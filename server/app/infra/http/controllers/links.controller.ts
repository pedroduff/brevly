import type { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShortLinkUseCase } from '../../../application/modules/shortLink/useCases/createShortLink.useCase.js';
import { DeleteShortLinkUseCase } from '../../../application/modules/shortLink/useCases/deleteShortLink.useCase.js';
import { GetOriginalUrlUseCase } from '../../../application/modules/shortLink/useCases/getOriginalUrl.useCase.js';
import { ListShortLinksUseCase } from '../../../application/modules/shortLink/useCases/listShortLinks.useCase.js';
import { ExportShortLinksToCsvUseCase } from '../../../application/modules/shortLink/useCases/exportShortLinksToCsv.useCase.js';
import { InvalidSlugFormatError } from '../../../domain/errors/invalidSlugFormatError.js';
import { SlugAlreadyExistsError } from '../../../domain/errors/slugAlreadyExistsError.js';
import { DomainError } from '../../../domain/errors/domainError.js';

interface CreateBody {
  slug: string;
  originalUrl: string;
}

interface ListQuerystring {
  limit?: string;
  cursor?: string;
}

export function createLinksController(deps: {
  createShortLink: CreateShortLinkUseCase;
  deleteShortLink: DeleteShortLinkUseCase;
  getOriginalUrl: GetOriginalUrlUseCase;
  listShortLinks: ListShortLinksUseCase;
  exportShortLinksToCsv: ExportShortLinksToCsvUseCase;
}) {
  return {
    async create(
      request: FastifyRequest<{ Body: CreateBody }>,
      reply: FastifyReply,
    ) {
      const { slug, originalUrl } = request.body ?? {};
      if (!slug || !originalUrl) {
        return reply.status(400).send({ error: 'slug and originalUrl required' });
      }
      try {
        const result = await deps.createShortLink.execute({ slug, originalUrl });
        return reply.status(201).send(result);
      } catch (err) {
        if (err instanceof SlugAlreadyExistsError) {
          return reply.status(409).send({ error: err.message });
        }
        if (err instanceof InvalidSlugFormatError || err instanceof DomainError) {
          return reply.status(400).send({ error: err.message });
        }
        throw err;
      }
    },

    async delete(
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) {
      const { id } = request.params;
      await deps.deleteShortLink.execute(id);
      return reply.status(204).send();
    },

    async getBySlug(
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) {
      const { slug } = request.params;
      const result = await deps.getOriginalUrl.execute(slug);
      if (!result) return reply.status(404).send({ error: 'Short link not found' });
      return reply.send({ originalUrl: result.originalUrl });
    },

    async list(
      request: FastifyRequest<{ Querystring: ListQuerystring }>,
      reply: FastifyReply,
    ) {
      const limit = Math.min(Number(request.query.limit) || 20, 100);
      const cursor = request.query.cursor;
      const result = await deps.listShortLinks.execute({ limit, cursor });
      return reply.send(result);
    },

    async export(_request: FastifyRequest, reply: FastifyReply) {
      const result = await deps.exportShortLinksToCsv.execute();
      return reply.send(result);
    },
  };
}
