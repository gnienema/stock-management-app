import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { DbModule } from 'src/db/db.module'; // <== Import

@Module({
  imports: [DbModule], // <== Ajout
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}