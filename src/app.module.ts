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
import { Cloudfunction } from './cloudfunctions/entities/cloudfunction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

console.log(path.join(__dirname, '.env'));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, '.env')],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    CloudfunctionsModule,
    IpaasModule,
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_SERVER_HOST'),
          port: configService.get('MYSQL_SERVER_PORT'),
          username: configService.get('MYSQL_SERVER_USER'),
          password: configService.get('MYSQL_SERVER_PASSWORD'),
          database: configService.get('MYSQL_SERVER_DATABASE'),
          synchronize: true,
          logging: true,
          entities: [
            Role,
            User,
            Permission,
            IpaasConnector,
            IpaasConnectorVersion,
            Cloudfunction,
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
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
