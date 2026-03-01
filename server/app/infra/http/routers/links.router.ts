import type { FastifyInstance } from 'fastify';
import type { createLinksController } from '../controllers/links.controller.js';

export function linksRouter(controller: ReturnType<typeof createLinksController>) {
  return async function register(app: FastifyInstance) {
    app.post('/', controller.create);
    app.get('/slug/:slug', controller.getBySlug);
    app.delete('/:id', controller.delete);
    app.get('/', controller.list);
    app.post('/export', controller.export);
  };
}
