import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        console.log('redis', configService.get('REDIS_URL'));
        const client = createClient({
          socket: {
            tls: true,
          },
          url: configService.get('REDIS_URL'),
        });
        await client.connect();
        console.log('Redis connected');
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
