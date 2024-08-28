import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './postgres/postgres.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
