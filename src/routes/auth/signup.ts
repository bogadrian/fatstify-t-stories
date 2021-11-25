import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

import { IUser } from '../../custom-types';

const signup: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  //ad a general Schema for this route
  fastify.addSchema({
    $id: 'signup',
    type: 'object',
    proprieties: {
      userName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      passwordConfiorm: { type: 'string' }
    }
  });

  // plugin for saving the user to MongoDb
  fastify.register(import('../../plugins/saveUserDb'));

  // plugin for sending an email confirmation
  fastify.register(import('../../plugins/sendEmailSignup'));

  // the final route handler
  fastify.route({
    method: 'POST',
    url: '/signup',
    // check the schema by its id
    schema: { body: { $ref: 'signup' } },
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      // call the insert user to db decorator

      const user = await fastify.dbInsert(req.body);

      if (!user) {
        throw fastify.httpErrors.createError(
          400,
          "That didn't work! Please try agian!"
        );
      }
      // call the send email confoirmation decorator
      await fastify.sendEmail(user, req.protocol, req.headers.host);

      //return the user
      return { message: 'success' };
    }
  });
};

declare module 'fastify' {
  interface FastifyReply {
    user: IUser | null;
  }
  interface FastifyInstance {
    dbInsert: any;
    sendEmail: any;
  }
}

export default signup;
