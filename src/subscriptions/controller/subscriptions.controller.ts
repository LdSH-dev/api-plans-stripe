import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from '../service/subscriptions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SubscriptionScheduler } from '../scheduler/subscription.scheduler';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService, private readonly scheduler: SubscriptionScheduler) {}

  @Post()
  createSubscription(@Body() data: { userId: string; planId: string }) {
    return this.subscriptionsService.createSubscription(data.userId, data.planId);
  }

  @Get(':id')
  getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionsService.getSubscriptionById(id);
  }

  @Delete(':id')
  cancelSubscription(@Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(id);
  }
  @Post('check-expired')
  async checkExpired() {
    return this.scheduler.checkExpiredSubscriptions();
  }

}
