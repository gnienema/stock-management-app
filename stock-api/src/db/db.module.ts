import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
  // VÉRIFIEZ BIEN QU'IL N'Y A PAS DE LIGNE 'controllers: [...]' ICI !
})
export class DbModule {}