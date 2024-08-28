import { Inject, Injectable } from '@nestjs/common';
import { VercelKV } from '@vercel/kv';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: VercelKV;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
