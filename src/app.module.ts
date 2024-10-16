import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonInterceptor } from './common/common.interceptor';
import { CloudfunctionsModule } from './cloudfunctions/cloudfunctions.module';
import { IpaasModule } from './ipaas/ipaas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/users.entity';
import { Permission } from './user/entities/permission.entity';
import { IpaasConnector } from './ipaas/entities/ipaas-connector.entity';
import { IpaasConnectorVersion } from './ipaas/entities/ipaas-connector-version.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: process.env.JWT_SECRET,
        };
      },
    }),
    UserModule,
    RedisModule,
    EmailModule,
    CloudfunctionsModule,
    IpaasModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'lflow',
      synchronize: true,
      logging: false,
      entities: [Role, User, Permission, IpaasConnector, IpaasConnectorVersion],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CommonInterceptor,
    },
  ],
})
export class AppModule {}
