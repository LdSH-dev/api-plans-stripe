import { Module } from '@nestjs/common';
import { PlansService } from '../service/plans.service';
import { PlansController } from '../controller/plans.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule {}
