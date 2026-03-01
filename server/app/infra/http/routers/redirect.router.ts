import type { FastifyInstance } from 'fastify';
import type { createRedirectController } from '../controllers/redirect.controller.js';

export function redirectRouter(controller: ReturnType<typeof createRedirectController>) {
  return async function register(app: FastifyInstance) {
    app.get('/:slug', controller.redirect);
  };
}
