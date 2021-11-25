import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import helmet from 'fastify-helmet';

export default fp<FastifyPluginAsync>(async (fastify, opts) => {
  fastify.register(require('fastify-cors'), {
    origin: process.env.CLIENT_APPLICATION_URL,
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE']
  });

  fastify.register(
    helmet,
    // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
    { contentSecurityPolicy: false }
  );

  fastify.register(require('fastify-sensible'));

  // register mongoose decorator
  fastify.register(import('./mongoose'));

  // register plugins
  // fastify.register(import('./plugins/sensible'));
  fastify.register(import('./accessToken'));

  fastify.decorate('auth', { dan: fastify });
});
