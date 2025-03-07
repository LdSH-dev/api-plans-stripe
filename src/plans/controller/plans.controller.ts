import { Controller, Get, Post, Delete, Body, Param, UseGuards  } from '@nestjs/common';
import { PlansService } from '../service/plans.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard} from '../../auth/guards/admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(AdminGuard)
  createPlan(@Body() data: { name: string; price: number;}) {
    return this.plansService.createPlan(data.name, data.price);
  }

  @Get()
  getAllPlans() {
    return this.plansService.getAllPlans();
  }

  @Get(':id')
  getPlanById(@Param('id') id: string) {
    return this.plansService.getPlanById(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deletePlan(@Param('id') id: string) {
    return this.plansService.deletePlan(id);
  }
}
