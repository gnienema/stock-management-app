// stock-api/src/stats/stats.controller.ts

import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  getDashboardStats() {
    // CORRECTION : Appel de la bonne fonction dans le service
    return this.statsService.getStats(); 
  }
}