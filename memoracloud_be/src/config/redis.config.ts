import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';

@Injectable()
export class RedisConfig implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    const enabled = process.env.REDIS_ENABLED === 'true';
    if (!enabled) {
      console.log('🔁 Redis disabled — using in-memory cache');
      return { ttl: 300, max: 100 };
    }
    console.log('🟢 Redis enabled for cache');
    return {
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
      ttl: 300,
    } as any;
  }
}
