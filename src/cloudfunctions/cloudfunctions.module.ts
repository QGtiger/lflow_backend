import { Module } from '@nestjs/common';
import { CloudfunctionsService } from './cloudfunctions.service';
import { CloudfunctionsController } from './cloudfunctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cloudfunction } from './entities/cloudfunction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cloudfunction])],
  controllers: [CloudfunctionsController],
  providers: [CloudfunctionsService],
})
export class CloudfunctionsModule {}
