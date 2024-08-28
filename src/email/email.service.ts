import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from 'src/constants';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: 'workflow',
        address: EMAIL_USER,
      },
      to,
      subject,
      html,
    });
  }
}
