import { FastifyPluginAsync } from 'fastify';

const test: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(require('fastify-url-data'));
  fastify.get('/test', async function (req, res) {
    return { status: 'test' };
  });
};

export default test;
