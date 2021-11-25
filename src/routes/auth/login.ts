import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import jwt from 'fastify-jwt';
import User from '../../models/users';
import * as jwtoken from 'jsonwebtoken';

const login: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(jwt, {
    secret: process.env.SECRET_REFRESH_TOKEN!
  });

  fastify.post(
    '/login',
    async function (request: FastifyRequest, reply: FastifyReply) {
      //extract the email and password from req.body

      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      // check if an email and a password was provided.if not stop here
      if (!email || !password) {
        throw fastify.httpErrors.createError(
          400,
          'Please provide an email and a password!'
        );
      }

      // find the user for that email
      const user = await User.findOne({ email }).select('+password');
      // check if the password is correct with a schemUser method function
      if (!user || !(await user.correctPassword(password, user.password))) {
        throw fastify.httpErrors.createError(404, 'User Not Found!');
      }

      const token = jwtoken.sign(
        { user: user._id },
        process.env.SECRET_ACCESS_TOKEN!,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        }
      );

      const refreshToken = fastify.jwt.sign(
        { id: user._id },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
        }
      );

      if (!user || !token || !refreshToken) {
        throw fastify.httpErrors.createError(400, 'Failure login!');
      }

      user.password = undefined;

      return { user, token, refreshToken };
    }
  );
};

declare module 'fastify-jwt' {
  interface FastifyJWT {
    id: string;
  }
}
export default login;
