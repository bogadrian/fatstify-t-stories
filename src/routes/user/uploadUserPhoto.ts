import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

const fileUpload = require('fastify-file-upload');
import User from '../../models/users';

const uploadUserPhoto: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.addSchema({
    $id: '/uploadUserPhoto',
    consumes: ['multipart/form-data'],
    requestBody: {
      description: 'File upload',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        }
      }
    }
  });

  fastify.register(fileUpload);
  fastify.register(import('../../plugins/uploadPhoto'));
  fastify.decorate('userPhoto', null);

  fastify.addHook('preValidation', async (req, reply, done) => {
    const request = await (req.raw as any).files;

    const res = await fastify.uploads(request);

    fastify.userPhoto = res;
  });

  fastify.route({
    method: 'PATCH',
    url: '/uploadUserPhoto',

    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const location = fastify.userPhoto.Location;

      const user = fastify.user;

      if (!location) {
        throw fastify.httpErrors.createError(
          400,
          'Photo not uploaded to s3. please try again!'
        );
      }

      const updatedUser = await User.updateOne(
        { _id: user._id },
        {
          $set: {
            photo: location
          }
        },

        (error: Error, doc: any) => {
          if (error) {
            throw fastify.httpErrors.createError(
              403,
              'We cannot upload ypur photo. Please try again.'
            );
          }
        }
      );

      if (!updatedUser) {
        throw fastify.httpErrors.createError(
          403,
          'We cannot verify your email! Please try agian later!'
        );
      }
      return 'success';
    }
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    uploads: (request: FastifyRequest) => { Location: string };
    userPhoto: { Location: string };
  }
  interface FastifyRequest {}
}
export default uploadUserPhoto;
