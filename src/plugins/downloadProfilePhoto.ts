import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import * as S3 from 'aws-sdk/clients/s3';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

export default fp<FastifyPluginAsync>(
  async (fastify: FastifyInstance, opts: {}) => {
    fastify.decorate('downloadProfilePhoto', fileKey => {
      const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
      };

      return s3.getObject(downloadParams).promise();
    });
  }
);

declare module 'fastify' {
  export interface FastifyInstance {}
}
