import { CacheModuleOptions } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import Redis from '@keyv/redis';

export const redisCacheConfig = async (): Promise<CacheModuleOptions> => {
  return {
    stores: [
      new Keyv({
        store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
      }),
      new Keyv({
        store: new Redis('redis://localhost:6379'),
      }),
    ],
  };
};
