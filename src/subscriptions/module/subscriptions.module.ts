import { Module } from '@nestjs/common';
import { SubscriptionsService } from '../service/subscriptions.service';
import { SubscriptionsController } from '../controller/subscriptions.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { SubscriptionScheduler } from '../scheduler/subscription.scheduler';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionsService, SubscriptionScheduler],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
