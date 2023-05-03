import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { z } from 'zod';
import * as services from './services';
import 'isomorphic-fetch';

type ServiceKeyof = keyof typeof services;
type ServiceContext<K extends ServiceKeyof> = z.infer<(typeof services)[K]['context']>;
type ServiceResult<K extends ServiceKeyof> = z.infer<(typeof services)[K]['result']>;

export type ServiceConstructorContext = {
  service: RedisService;
};

@Injectable()
export class RedisService implements OnModuleInit {
  private ratelimiter_common_cache: Map<string, number> = new Map();
  private ratelimiter_heavy_cache: Map<string, number> = new Map();
  private ratelimiter_slow_cache: Map<string, number> = new Map();

  redis = Redis.fromEnv();
  ratelimiter_common: Ratelimit;
  ratelimiter_heavy: Ratelimit;
  ratelimiter_slow: Ratelimit;

  constructor() {}

  async onModuleInit() {
    this.ratelimiter_common = new Ratelimit({
      redis: this.redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests per 10 seconds
      analytics: true,
      prefix: '@travelerspen/ratelimit',
      timeout: 3000, // 3s
      ephemeralCache: this.ratelimiter_common_cache,
    });

    this.ratelimiter_heavy = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '60 s'), // 3 requests per 1 minute
      analytics: true,
      prefix: '@travelerspen/ratelimit',
      ephemeralCache: this.ratelimiter_heavy_cache,
    });

    this.ratelimiter_slow = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(1, '300 s'), // 3 requests per 1 minute
      analytics: true,
      prefix: '@travelerspen/ratelimit',
      ephemeralCache: this.ratelimiter_slow_cache,
    });
  }

  async service<T extends ServiceKeyof>(key: T, data: ServiceContext<T>): Promise<ServiceResult<T>> {
    const service = services[key];
    return await service.default(
      {
        service: this,
      },
      data
    );
  }
}
