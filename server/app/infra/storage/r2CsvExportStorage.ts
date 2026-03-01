import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { CsvExportStorage } from '../../application/modules/shortLink/useCases/exportShortLinksToCsv.useCase.js';

function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) return '';
  return val.trim();
}

const R2_ENV_KEYS = [
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_ACCESS_KEY_ID',
  'CLOUDFLARE_SECRET_ACCESS_KEY',
  'CLOUDFLARE_BUCKET',
  'CLOUDFLARE_PUBLIC_URL',
] as const;

export function createR2CsvExportStorage(): CsvExportStorage {
  const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
  const accessKeyId = getEnv('CLOUDFLARE_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('CLOUDFLARE_SECRET_ACCESS_KEY');
  const bucket = getEnv('CLOUDFLARE_BUCKET');
  const publicUrl = getEnv('CLOUDFLARE_PUBLIC_URL').replace(/\/$/, '');

  // Debug: log estado das variáveis R2 (sem expor valores sensíveis)
  const debug = Object.fromEntries(
    R2_ENV_KEYS.map((k) => [k, process.env[k] ? '(set)' : '(missing)']),
  );
  console.log('[R2 CSV Export] env check:', debug);
  const hasCreds = Boolean(accountId && accessKeyId && secretAccessKey);
  const hasBucket = Boolean(bucket);
  if (!hasCreds || !hasBucket) {
    console.warn(
      '[R2 CSV Export] usando fallback (example.com). Credenciais:',
      hasCreds,
      'Bucket:',
      hasBucket,
    );
  } else {
    console.log('[R2 CSV Export] configurado. Endpoint:', `${accountId.slice(0, 8)}...r2.cloudflarestorage.com`);
  }

  const client =
    accountId && accessKeyId && secretAccessKey
      ? new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: { accessKeyId, secretAccessKey },
        })
      : null;

  return {
    async upload(content: string, filename: string): Promise<string> {
      if (!client || !bucket) {
        return `${publicUrl || 'https://example.com'}/${filename}`;
      }
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: Buffer.from(content, 'utf-8'),
          ContentType: 'text/csv',
        }),
      );
      return `${publicUrl}/${filename}`;
    },
  };
}
