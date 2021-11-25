import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyInstance,
  FastifyReply
} from 'fastify';

import { isAfter } from 'date-fns';

type CustomRequest = FastifyRequest & { query: { token: string } };

import User from '../../models/users';
import * as jwtoken from 'jsonwebtoken';

const confirmEmail: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(import('../../plugins/template'));

  fastify.route({
    method: 'GET',
    url: '/confirmEmail',
    schema: {
      querystring: {
        name: { type: 'string' }
      },
      params: { name: { type: 'string' } }
    },
    handler: async (req: CustomRequest, reply: FastifyReply) => {
      const token = req.query.token;

      if (!token) {
        throw fastify.httpErrors.createError(
          404,
          'We cannot verify your email! Please try agian!'
        );
      }

      const decoded = jwtoken.verify(
        token,
        process.env.SECRET_EMAIL_CONFIRM!
      ) as {
        user: string;
        exp: number;
      };

      if (!decoded) {
        throw fastify.httpErrors.createError(
          403,
          'We cannot verify your email! Please try agian!'
        );
      }

      const { user: id, exp: expirationDate } = decoded;

      const tokenExpiresdAt = new Date(expirationDate * 1000);

      if (isAfter(new Date(Date.now()), tokenExpiresdAt)) {
        throw fastify.httpErrors.createError(
          403,
          'We cannot verify your email! Please try agian!'
        );
      }

      if (!id) {
        throw fastify.httpErrors.createError(
          403,
          'We cannot verify your email! Please try agian!'
        );
      }

      const user = await User.findById(id);
      const { _id } = user;

      const updatedUser = await User.updateOne(
        { _id },
        { $set: { emailConfirmed: true } },
        { new: false },
        (error: Error, doc: any) => {
          if (error) {
            throw fastify.httpErrors.createError(
              403,
              'We cannot verify your email! Please try agian later!'
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

      return reply.view('/public/templates/emailConfirmed.hbs', {
        name: user.userName,
        url: `${process.env.CLIENT_APPLICATION_URL}/auth`
      });
    }
  });
};

export default confirmEmail;

declare module 'fastify' {
  interface FastifyInstance {
    req: { query: { token: string } };
  }
  interface FastifyReply {
    view: any;
  }
}
