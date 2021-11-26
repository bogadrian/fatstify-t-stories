import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(import('./signup'));
  fastify.register(import('./login'));
  fastify.register(import('./refresh'));
  fastify.register(import('./newRefreshToken'));
  fastify.register(import('./setUserEmailConfirm'));
  fastify.register(import('./forgotPassword'));
  fastify.register(import('./resetPassword'));
  fastify.register(import('./signOut'));
};

export default auth;
