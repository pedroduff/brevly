import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// .env em server/: tsx usa server/app (../.env), node dist usa server/dist/app (../../.env)
const envDir = path.resolve(__dirname, '../.env');
const envDirDist = path.resolve(__dirname, '../../.env');
const envPath = fs.existsSync(envDir) ? envDir : envDirDist;
config({ path: envPath });

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createShortLinkRepository } from './infra/DB/repositories/shortLink.repository.js';
import { createR2CsvExportStorage } from './infra/storage/r2CsvExportStorage.js';
import { createAccessProducer } from './infra/kafka/accessProducer.js';
import { startAccessConsumer } from './infra/kafka/accessConsumer.js';
import { createLinksController } from './infra/http/controllers/links.controller.js';
import { createRedirectController } from './infra/http/controllers/redirect.controller.js';
import { linksRouter } from './infra/http/routers/links.router.js';
import { redirectRouter } from './infra/http/routers/redirect.router.js';
import { CreateShortLinkUseCase } from './application/modules/shortLink/useCases/createShortLink.useCase.js';
import { DeleteShortLinkUseCase } from './application/modules/shortLink/useCases/deleteShortLink.useCase.js';
import { GetOriginalUrlUseCase } from './application/modules/shortLink/useCases/getOriginalUrl.useCase.js';
import { ListShortLinksUseCase } from './application/modules/shortLink/useCases/listShortLinks.useCase.js';
import { IncrementAccessCountUseCase } from './application/modules/shortLink/useCases/incrementAccessCount.useCase.js';
import { ExportShortLinksToCsvUseCase } from './application/modules/shortLink/useCases/exportShortLinksToCsv.useCase.js';

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS "short_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(32) NOT NULL UNIQUE,
  "original_url" varchar(2048) NOT NULL,
  "access_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
`;

async function bootstrap() {
  const connectionString =
    process.env.DATABASE_URL ?? 'postgresql://app:app@localhost:5432/app';
  const pool = new Pool({ connectionString });
  await pool.query(MIGRATION_SQL);
  const db = drizzle({ client: pool });

  const shortLinkRepository = createShortLinkRepository(db);
  const csvStorage = createR2CsvExportStorage();
  const accessPublisher = createAccessProducer();
  await accessPublisher.connect();

  const port = Number(process.env.PORT) || 3000;
  const redirectBaseUrl =
    process.env.REDIRECT_BASE_URL ?? `http://localhost:${port}`;

  const createShortLink = new CreateShortLinkUseCase(shortLinkRepository);
  const deleteShortLink = new DeleteShortLinkUseCase(shortLinkRepository);
  const getOriginalUrl = new GetOriginalUrlUseCase(shortLinkRepository);
  const listShortLinks = new ListShortLinksUseCase(
    shortLinkRepository,
    redirectBaseUrl,
  );
  const incrementAccessCount = new IncrementAccessCountUseCase(shortLinkRepository);
  const exportShortLinksToCsv = new ExportShortLinksToCsvUseCase(
    shortLinkRepository,
    csvStorage,
  );

  startAccessConsumer(incrementAccessCount).catch((err) => {
    console.error('Access consumer error:', err);
  });

  const recordAccess = process.env.KAFKA_BROKERS
    ? (slug: string) => accessPublisher.publish(slug).catch(() => {})
    : (slug: string) => incrementAccessCount.execute(slug);

  const linksController = createLinksController({
    createShortLink,
    deleteShortLink,
    getOriginalUrl,
    listShortLinks,
    exportShortLinksToCsv,
  });
  const redirectController = createRedirectController(
    getOriginalUrl,
    recordAccess,
  );

  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  app.get('/health', async () => ({ status: 'ok' }));
  await app.register(linksRouter(linksController), { prefix: '/links' });
  await app.register(redirectRouter(redirectController), { prefix: '/r' });

  await app.listen({ port, host: '0.0.0.0' });

  const shutdown = async () => {
    await app.close();
    await pool.end();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
