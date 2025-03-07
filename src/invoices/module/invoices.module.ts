import { Module } from '@nestjs/common';
import { InvoiceService } from '../service/invoices.service';
import { InvoiceController } from '../controller/invoices.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailModule } from '../../email/module/email.module';

@Module({
  imports: [EmailModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
})
export class InvoiceModule {}
