import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { InvoiceService } from '../service/invoices.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':id')
  async getInvoice(@Param('id') invoiceId: string) {
    try {
      return await this.invoiceService.getInvoice(invoiceId);
    } catch (error) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`);
    }
  }

  @Get('/user/:userId')
  async getInvoicesByUser(@Param('userId') userId: string) {
    try {
      return await this.invoiceService.getInvoicesByUser(userId);
    } catch (error) {
      throw new NotFoundException(`Error fetching invoices for user ${userId}.`);
    }
  }

  @Get('/send/:id')
  async sendInvoice(@Param('id') invoiceId: string) {
    try {
      return await this.invoiceService.sendStoredInvoice(invoiceId);
    } catch (error) {
      throw new NotFoundException(`Error sending invoice ${invoiceId}.`);
    }
  }
}
