import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';

@Module({
  imports: [
    // PostgresModule,
    // UserModule,
    // RedisModule,
    // EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
  ],
})
export class AppModule {}
