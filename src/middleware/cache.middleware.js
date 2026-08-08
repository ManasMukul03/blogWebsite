import redisClient from '../config/redis.js';

const cache = (keyPrefix, ttlSeconds = 60) => {
    return async (req, res, next) => {
        const key = `${keyPrefix}:${req.originalUrl}`;

        try {
            const cached = await redisClient.get(key);

            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }

            const originalJson = res.json.bind(res);

            res.json = (body) => {
                redisClient.setEx(key, ttlSeconds, JSON.stringify(body)).catch(
                    (err) => console.error('Redis set error', err)
                );
                return originalJson(body);
            };

            next();

        } catch (error) {
            console.error('Redis get error', error);
            next();
        }
    };
};

export default cache;
