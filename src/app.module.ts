import { Module } from '@nestjs/common';
import { AuthModule } from './auth/module/auth.module';
import { PlansModule } from './plans/module/plans.module';
import { SubscriptionsModule } from './subscriptions/module/subscriptions.module';
import { PaymentsModule } from './payments/module/payments.module';
import { InvoiceModule } from './invoices/module/invoices.module';
import { EmailModule } from './email/module/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule,SubscriptionsModule, PaymentsModule , PlansModule, PrismaModule, InvoiceModule, EmailModule],
})
export class AppModule {}
