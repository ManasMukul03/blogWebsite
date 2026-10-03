import redisClient from '../config/redis.js';

// SCAN instead of KEYS so Redis isn't blocked while walking the keyspace.
export const clearCacheByPrefix = async (prefix) => {
    for await (const keys of redisClient.scanIterator({ MATCH: `${prefix}:*`, COUNT: 100 })) {
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
};
