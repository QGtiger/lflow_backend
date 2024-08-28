import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { REDIS_URL } from 'src/constants';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            tls: true,
          },
          url: REDIS_URL,
        });
        await client.connect();
        console.log('Redis connected');
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
