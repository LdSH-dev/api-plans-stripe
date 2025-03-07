import { Module } from '@nestjs/common';
import { PaymentsService } from '../service/payments.service';
import { PaymentsController } from '../controller/payments.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
// import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
