import { Module } from '@nestjs/common';
import { IpaasService } from './ipaas.service';
import { IpaasController } from './ipaas.controller';

@Module({
  controllers: [IpaasController],
  providers: [IpaasService],
})
export class IpaasModule {}
