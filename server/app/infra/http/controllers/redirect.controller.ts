import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GetOriginalUrlUseCase } from '../../../application/modules/shortLink/useCases/getOriginalUrl.useCase.js';

export type RecordAccessFn = (slug: string) => Promise<void>;

export function createRedirectController(
  getOriginalUrl: GetOriginalUrlUseCase,
  recordAccess: RecordAccessFn,
) {
  return {
    async redirect(
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) {
      const { slug } = request.params;
      const result = await getOriginalUrl.execute(slug);
      if (!result) {
        return reply.status(404).send({ error: 'Short link not found' });
      }
      await recordAccess(slug);
      return reply.redirect(result.originalUrl, 302);
    },
  };
}
