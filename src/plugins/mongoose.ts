import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');

// npm install mongoose
const pass = process.env.PASS;
const DB = process.env.DB?.replace('<PASSWORD>', pass!);

export default fp<FastifyPluginAsync>(
  async (fastify: FastifyInstance, opts: {}) => {
    fastify.decorate('db', null);

    fastify.register(async (req, reply, done) => {
      fastify.db = await mongoose.connect(DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      done();
    });
  }
);

declare module 'fastify' {
  export interface FastifyInstance {
    db: Mongoose;
  }
}
