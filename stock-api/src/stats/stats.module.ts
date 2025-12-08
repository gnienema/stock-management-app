import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { DbModule } from 'src/db/db.module'; // <== On importe la BDD pour les calculs

@Module({
  imports: [DbModule], 
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}