import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import * as jwtoken from 'jsonwebtoken';

import * as sendinBlue from 'nodemailer-sendinblue-transport';
import * as nodemailer from 'nodemailer';

import { resetPasswordEmail } from '../emailServices/confirmEmail';

export default fp<FastifyPluginAsync>(async (fastify, opts) => {
  fastify.decorate(
    'sendEmailResetPassword',
    user => {
      const send = async () => {
        const forgotPasswordToken = jwtoken.sign(
          { user: user._id },
          process.env.SECRET_FORGOT_PASSWORD!,
          {
            expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN
          }
        );

        const transport = nodemailer.createTransport(
          sendinBlue({
            apiKey: '5D2CPL74vzYqV3Gs'
          })
        );

        if (user) {
          const url = `${process.env.CLIENT_APPLICATION_URL}/resetPassword/${forgotPasswordToken}`;
          const title = 'Reset your password';
          console.log('uuuu', user.userName);

          transport.sendMail(
            {
              from: 'sender@example.com',
              to: 'bogdan44adrian@yahoo.it',
              subject: 'testing',
              html: resetPasswordEmail(title, user.userName, url)
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
    []
  );
});
