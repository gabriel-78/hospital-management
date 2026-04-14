import type { CacheProvider } from '@/shared/domain/cache/cache-provider.interface.js';
import { redisClient } from './redis.client.js';

export class RedisCacheProvider implements CacheProvider {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlInSeconds: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlInSeconds });
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
