import redisClient from '../config/redis.js';

export const clearCacheByPrefix = async (prefix) => {
    const keys = await redisClient.keys(`${prefix}:*`);

    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};
