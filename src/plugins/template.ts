import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

export default fp<FastifyPluginAsync>(async (fastify, opts) => {
  fastify.register(require('point-of-view'), {
    engine: {
      handlebars: require('handlebars')
    }
  });
});
