import { Module } from '@nestjs/common';
import { CloudfunctionsService } from './cloudfunctions.service';
import { CloudfunctionsController } from './cloudfunctions.controller';

@Module({
  controllers: [CloudfunctionsController],
  providers: [CloudfunctionsService],
})
export class CloudfunctionsModule {}
