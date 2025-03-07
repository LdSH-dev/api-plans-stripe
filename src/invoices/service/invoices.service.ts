import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '../../email/service/email.service';
import { Stripe } from 'stripe';

@Injectable()
export class InvoiceService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService, private readonly emailService: EmailService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async getInvoice(invoiceId: string) {
    try {
      const invoice = await this.prisma.invoice.findFirst({ where: {id: invoiceId} });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
      }
      return invoice;
    } catch (error) {
      throw new NotFoundException(`Invoice not fount: ${error.message}`);
    }
  }

  async getInvoicesByUser(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: {id: userId} });
      if (!user) {
        throw new NotFoundException(`Customer with ID ${userId} not found`);
      }

      const invoices = await this.prisma.invoice.findMany({
        where: { userId: userId }
      });

      if (!invoices.length) {
        throw new NotFoundException(`No invoice found for user with ID ${userId}`);
      }

      return invoices.map(invoice => ({
        id: invoice.id,
        invoiceId: invoice.invoiceId,
        status: invoice.status,
        amount: invoice.amount,
        currency: invoice.currency.toUpperCase(),
        createdAt: invoice.createdAt,
        sentAt: invoice.sentAt,
      }));
    } catch (error) {
      throw new NotFoundException(`Error fetching invoices for user ${userId}: ${error.message}`);
    }
  }
  async sendStoredInvoice(invoiceId: string) {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId }
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: invoice.userId }
      });

      if (!user || !user.email) {
        throw new NotFoundException(`User associated with invoice not found.`);
      }

      const emailData = {
        customerName: user.email,
        invoiceId: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency.toUpperCase(),
        status: invoice.status,
        createdAt: invoice.createdAt.toLocaleDateString(),
      };

      await this.emailService.sendInvoiceEmail(user.email, emailData);

      return { message: `Invoice ${invoice.id} sent to ${user.email}` };
    } catch (error) {
      throw new NotFoundException(`Error sending invoice: ${error.message}`);
    }
  }
}
