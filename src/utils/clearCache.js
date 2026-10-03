import redisClient, { isRedisReady } from '../config/redis.js';

// SCAN instead of KEYS so Redis isn't blocked while walking the keyspace.
// Never throws: a cache problem shouldn't fail the write that triggered it.
export const clearCacheByPrefix = async (prefix) => {
    if (!isRedisReady()) return;

    try {
        for await (const keys of redisClient.scanIterator({ MATCH: `${prefix}:*`, COUNT: 100 })) {
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }
    } catch (error) {
        console.error('Redis cache clear error', error.message);
    }
};
