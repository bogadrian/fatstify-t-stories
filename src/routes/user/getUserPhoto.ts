import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const getUserPhoto: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.register(import('../../plugins/downloadProfilePhoto'));
  fastify.get(
    '/getMyPhoto/:key',
    async function (req: FastifyRequest & { params: { key: string } }, reply) {
      const resStream = await fastify.downloadProfilePhoto(req.params.key);

      //   let buf = Buffer.from(resStream.Body);
      //   let base64 = buf.toString('base64');

      //   if (!resStream) {
      //     throw fastify.httpErrors.createError(
      //       400,
      //       'Photo not downloaded from s3. please try again!'
      //     );
      //   }
      //   reply.headers({
      //     'Content-Type': 'application/octet-stream'
      //   });
      //   const src = `data:image/*;base64, ${base64}`;

      reply.send(resStream);
    }
  );
};

declare module 'fastify' {
  interface FastifyInstance {
    downloadProfilePhoto: any;
  }
}
export default getUserPhoto;
