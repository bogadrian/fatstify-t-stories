import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import * as aws from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

const storage = multerS3({
  s3,
  bucket: bucketName,
  metadata: function (req: any, file, cb) {
    cb(null, { filedname: file.fieldname });
  },
  key: function (req: any, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname);

    cb(null, `${name.replace(/\s/g, '')}-${Date.now()}${ext}`);
  }
});

export const uploadPhoto: any = multer({
  storage,
  fileFilter
});

// export default fp<FastifyPluginAsync>(
//   async (fastify: FastifyInstance, opts: {}) => {
//     fastify.decorate('uploads', req => {
//       console.log('qwedwedfwed', req);
//       return uploadPhoto.single('image-profile');
//     });
//   }
// );
