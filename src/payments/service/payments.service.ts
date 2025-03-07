import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(userId: string, amount: number, currency: string = 'eur') {
    let user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!user.customerId)
    {
      const newCustomer = await this.stripe.customers.create({ email: user.email });

      user = await this.prisma.user.update({
        where: { id: userId },
        data: { customerId: newCustomer.id },
      });
    }
    await this.stripe.testHelpers.customers.fundCashBalance(user.customerId , {
      amount: Math.round(amount * 100),
      currency: 'eur',
    });

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'customer_balance',
      billing_details: {
        name: 'John Doe',
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: user.customerId,
      payment_method: paymentMethod.id,
      payment_method_options: {
        customer_balance: {
          funding_type: 'bank_transfer',
          bank_transfer: {
            type: 'eu_bank_transfer',
            eu_bank_transfer: {
              country: 'DE',
            },
          },
        },
      },
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    await this.prisma.payment.create({
      data: {
        id: paymentIntent.id,
        userId,
        amount,
        currency,
        status: 'pending',
      },
    });
    return {
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount_received / 100,
    };
  }

  async handleStripeWebhook(event: any) {
    const { type, data } = event;
    const identifier = data.object.id;

    if (type === 'payment_intent.succeeded') {
      await this.prisma.payment.update({
        where: { id: identifier },
        data: { status: 'succeeded' },
      });
    } else if (type === 'payment_intent.payment_failed') {
      await this.prisma.payment.update({
        where: { id: identifier },
        data: { status: 'failed' },
      });
    } else if (type === 'customer.subscription.updated') {
      if (identifier) {
        if (!data.object.cancel_at_period_end) {
          await this.prisma.subscription.update({
            where: { stripeSubscriptionId: identifier },
            data: { isActive: true },
          });
        }
      }
    } else if (type === 'invoice.paid') {
      if (identifier) {
        await this.prisma.invoice.update({
          where: { invoiceId: identifier },
          data: { status: 'paid' },
        });
      }
      if (identifier) {
        await this.prisma.subscription.update({
          where: { stripeSubscriptionId: data.object.subscription },
          data: { isActive: true },
        });
      }
    }

    return { received: true };
  }

}
