import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import User from '../models/users';

export default fp<FastifyPluginAsync>(async (fastify, opts) => {
  fastify.decorate('dbInsert', async body => {
    const { userName, email, password, passwordConfirm } = body;

    // check if an email and a password was provided.if not stop here
    if (!userName || !email || !password || !passwordConfirm) {
      throw fastify.httpErrors.createError(
        400,
        'Please provide a name, email and password!'
      );
    }
    // create the user in db. Before creating the user with a Mongoose niddlware 'save' hook hash the password. this is syncronus here because a decorator is syncronus. we will 'await' it later when it is invoked in signup route!
    return User.create({
      userName,
      email,
      password,
      passwordConfirm
    });
  });
});
