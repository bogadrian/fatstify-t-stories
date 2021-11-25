import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';

import * as jwtoken from 'jsonwebtoken';

import User from '../models/users';
import { IUser } from 'custom-types.js';
//const createError = require('http-errors');
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorateReply('user', null);
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const token = request.headers.authorization.split(' ')[1];

        // verify the token with the fastify-jwt jwtVerify() method. This will return the payload (the id in this case) and the iat (issued at time) default jwt parameter.

        const decoded = jwtoken.verify(
          token,
          process.env.SECRET_ACCESS_TOKEN!
        ) as {
          user: string;
          exp: number;
        };

        if (!decoded) {
          throw fastify.httpErrors.createError(
            404,
            'You are not authenticated. Please login!'
          );
        }

        const { user: id, exp } = decoded;

        // find if the user still exists

        const user = await User.findById(id);

        // if the user no longer exists, denay protected routes

        if (!user) {
          throw fastify.httpErrors.createError(
            403,
            'The user with this email no longer exists!'
          );
        }

        // find if the user has a token issued before the password was changed. In that case the token is suppose to not be valid anymore. use a userSchema method to perform that check.

        const freshUser = await user.changedPasswordAfter(exp * 1000);

        // // if there is a freshUser that means the user has an old token issued before he has changed his password. Denay access to the protected routes.

        if (freshUser) {
          throw fastify.httpErrors.createError(
            403,
            'The password was changed after the token was issued. Please login again!'
          );
        }

        fastify.user = user;

        // put the newly verified user in request so you can use it down the pipe.
      } catch (err: any) {
        // reply.send(err);
        throw fastify.httpErrors.createError(401, 'Token expired');
      }
      // if the code got here and no error was thrown, means we can grant access to the protected routes that uses this autenticate decorater in a hook such as 'onRequest' or 'preValidate'
    }
  );
});

// // When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    authPlugin(): string;
    user: IUser;
  }
}
