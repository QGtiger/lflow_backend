import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from '@vercel/kv';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        });
        console.log('Redis connected');
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
