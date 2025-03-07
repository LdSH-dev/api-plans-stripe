import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter;
  private logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailersend.net',
      port: 587,
      auth: {
        user: 'MS_6283Qh@trial-z3m5jgr3r7dgdpyo.mlsender.net',
        pass: 'mssp.de3lalI.3yxj6lj6erx4do2r.kmMeoZN',
      }
    });
  }
  async sendInvoiceEmail(to: string, invoiceData: any) {
    try {
      const templatePath = path.join(process.cwd(), 'src', 'email', 'templates', 'invoice.html');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      const htmlContent = template(invoiceData);

      const mailOptions = {
        from: `"Billing Team" <MS_6283Qh@trial-z3m5jgr3r7dgdpyo.mlsender.net>`,
        to,
        subject: `Invoice #${invoiceData.invoiceId} - ${invoiceData.amount} ${invoiceData.currency}`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);

      return { success: true, message: `Email sent to ${to}` };
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
