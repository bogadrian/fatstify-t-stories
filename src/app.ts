import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync, FastifyRequest } from 'fastify';

import { join } from 'path';

export type AppOptions = {
  logger: true;
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  });
};

export default app;
