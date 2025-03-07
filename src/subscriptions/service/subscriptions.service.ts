import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createSubscription(userId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);

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
    console.log(user.customerId);
    await this.stripe.testHelpers.customers.fundCashBalance(user.customerId , {
      amount: Math.round(plan.price * 100),
      currency: 'eur',
    });

    const stripeSubscription = await this.stripe.subscriptions.create({
      customer: user.customerId,
      items: [{ price: plan.stripePriceId }],
      collection_method: 'send_invoice',
      days_until_due: 7,
      payment_settings: {
        payment_method_types: ['customer_balance'],
      },
      expand: ['latest_invoice'],
    });

    const invoiceId = typeof stripeSubscription.latest_invoice === 'string'
      ? stripeSubscription.latest_invoice
      : stripeSubscription.latest_invoice?.id;

    if (!invoiceId) {
      throw new NotFoundException('Invoice not found in subscription.');
    }

    const invoice = await this.stripe.invoices.finalizeInvoice(invoiceId);
    await this.stripe.invoices.pay(invoice.id, {
      paid_out_of_band: true,
    });

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId,
        startDate,
        endDate,
        isActive: false,
        stripeSubscriptionId: stripeSubscription.id,
      },
    });

    if (invoice.payment_intent) {
      await this.prisma.invoice.create({
        data: {
          userId,
          invoiceId: invoice.id,
          amount: plan.price,
          currency: 'eur',
          status: invoice.status,
          createdAt: new Date(),
          sentAt: new Date(),
        },
      });
    }


    return {
      subscriptionId: subscription.id,
      stripeSubscriptionId: stripeSubscription.id,
      invoiceId: invoice?.id,
      invoiceUrl: invoice?.hosted_invoice_url,
      status: stripeSubscription.status,
    };
  }

  async cancelSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.stripeSubscriptionId) {
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    return this.prisma.subscription.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getSubscriptionById(id: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }
}