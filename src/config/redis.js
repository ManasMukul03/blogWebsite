import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        // keep retrying in the background, backing off up to 30s
        reconnectStrategy: (retries) => Math.min(retries * 500, 30000)
    }
});

// Log at most one error per minute so an unreachable Redis doesn't flood the logs
let lastErrorLoggedAt = 0;
redisClient.on('error', (err) => {
    if (Date.now() - lastErrorLoggedAt > 60 * 1000) {
        lastErrorLoggedAt = Date.now();
        console.error('Redis Client Error (caching disabled until it reconnects):', err.message);
    }
});

redisClient.on('ready', () => console.log('Redis Connected'));

// Redis is only a cache: callers skip it unless the connection is ready.
export const isRedisReady = () => redisClient.isReady;

// Starts connecting without blocking server startup.
export const connectRedis = () => {
    if (!process.env.REDIS_URL) {
        console.warn('REDIS_URL not set, caching disabled');
        return;
    }

    redisClient.connect().catch((err) =>
        console.error('Redis connection failed:', err.message)
    );
};

export default redisClient;
