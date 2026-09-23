import nodemailer from 'nodemailer';
import { EmailProvider, SendEmailOptions, SendEmailResult } from './emailProvider';

export class SmtpProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      return {
        providerId: info.messageId || `smtp_${Date.now()}`,
      };
    } catch (error: any) {
      console.error('[SmtpProvider] Delivery failed:', error);
      return {
        providerId: '',
        error: error.message || 'SMTP delivery failed',
      };
    }
  }
}
