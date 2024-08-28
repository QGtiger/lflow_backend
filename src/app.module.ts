import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './postgres/postgres.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PostgresModule, UserModule],
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
