import nodemailer, { Transporter } from 'nodemailer';
import Env from '@ioc:Adonis/Core/Env'

class MailerConfig {
  private transporter: Transporter;

  constructor() {
    this.transporter = this.buildTransporter()
  }

  buildTransporter(): Transporter {
    return nodemailer.createTransport({
      host: Env.get('MAIL_HOST'),
      port: Env.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: Env.get('MAIL_USERNAME'),
        pass: Env.get('MAIL_PASSWORD'),
      },
    });
  }

  getTransporter(): Transporter {
    return this.transporter;
  }
}

export default new MailerConfig().getTransporter();