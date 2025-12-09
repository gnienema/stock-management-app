import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
// import { DbModule } from 'src/db/db.module';

@Module({
  imports: [], // <== Ajout
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule { }