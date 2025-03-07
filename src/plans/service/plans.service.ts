import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PlansService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPlan(name: string, price: number) {
    const product = await this.stripe.products.create({
      name,
      type: 'service',
    });

    const stripePrice = await this.stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100),
      currency: 'eur',
      recurring: { interval: 'month' },
    });

    return this.prisma.plan.create({
      data: {
        name,
        price,
        stripeProductId: product.id,
        stripePriceId: stripePrice.id,
      },
    });
  }

  async getAllPlans() {
    return this.prisma.plan.findMany();
  }

  async getPlanById(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async deletePlan(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    await this.stripe.products.update(plan.stripeProductId, { active: false });

    return this.prisma.plan.delete({ where: { id } });
  }
}
