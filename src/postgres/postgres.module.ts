import { Global, Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    PostgresService,
    {
      provide: 'POSTGRES_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = new Client({
          connectionString: configService.get('POSTGRES_URL'),
        });
        await client.connect();

        console.log('Connected to Postgres database and created users table');
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,    -- 自增主键
            username VARCHAR(255) UNIQUE NOT NULL,  -- 用户名，唯一且非空
            password VARCHAR(255) NOT NULL,  -- 密码，非空
            email VARCHAR(255) UNIQUE NOT NULL,  -- 电子邮件，唯一且非空
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- 创建时间，默认为当前时间
          );
        `);

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PostgresService],
})
export class PostgresModule {}
