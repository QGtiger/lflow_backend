export declare class RedisService {
    private redisClient;
    get(key: string): Promise<string>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
}
