/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendPasswordReset(email: string, resetCodeMsg: string) {
    const message = `Hi ${email},\n We received a request to reset the password on your NestJS Account. \n ${resetCodeMsg} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The NestJS Team`;

    await this.transporter.sendMail({
      from: 'NestJS App <hassanelsherbiny.tests23@gmail.com>', // sender address
      to: email,
      subject: 'Password Reset',
      text: `Your password reset code is : \n ${message}.`,
    });
  }
}
