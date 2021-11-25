import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import * as jwtoken from 'jsonwebtoken';

import * as sendinBlue from 'nodemailer-sendinblue-transport';
import * as nodemailer from 'nodemailer';

import { confirmEmail } from '../emailServices/confirmEmail';

export default fp<FastifyPluginAsync>(async (fastify, opts) => {
  fastify.decorate(
    'sendEmail',
    (user, protocol, host) => {
      const send = async () => {
        const emailConfirmToken = await jwtoken.sign(
          { user: user?._id, issuedDate: Date.now() },
          process.env.SECRET_EMAIL_CONFIRM!,
          {
            expiresIn: process.env.JWT_EMAIL_CONFITM_EXPIRES_IN
          }
        );

        const transport = nodemailer.createTransport(
          sendinBlue({
            apiKey: process.env.SENDIBLUE_KEY
          })
        );

        if (user) {
          const url = `${protocol}://${host}/auth/confirmEmail?token=${emailConfirmToken}`;

          const title = 'Confirm your email';
          transport.sendMail(
            {
              from: process.env.EMAIL_SENDER,
              to: process.env.EMAIL_RECEIVER,
              subject: 'testing',
              html: confirmEmail(title, user.userName, url)
            },
            // if error on sending email return it here
            (err, info) => {
              if (err) {
                throw fastify.httpErrors.createError(400, info);
              }
            }
          );
        }
      };
      send();
    },
    ['dbInsert']
  );
});
