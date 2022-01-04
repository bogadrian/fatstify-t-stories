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
    fastify.decorate('uploads', req => {
      const file = req['image-profile'];

      if (!file.mimetype.startsWith('image')) {
        throw fastify.httpErrors.createError(
          400,
          'Please upload only imgaes jpeg, jpg, png!'
        );
      }

      const uploadParams = {
        Bucket: bucketName,
        Body: file.data,
        Key: file.name,
        ContentType: file.mimetype
      };

      const data = s3.upload(uploadParams).promise();
      return data;
    });
  }
);
