import { Controller, Post, Get, Body, Param, Req, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../service/payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() data: { userId: string; amount: number; currency?: string }) {
    return this.paymentsService.createPaymentIntent(data.userId, data.amount, data.currency);
  }

  @Get(':id')
  getPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id);
  }

  @Post('/webhooks/stripe')
  @Public()
  async handleStripeWebhook(@Req() req, @Headers('stripe-signature') signature: string) {
    const event = req.body;
    return this.paymentsService.handleStripeWebhook(event);
  }
}