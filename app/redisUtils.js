import bb from "bluebird";
import _redis from "redis";
const redis = bb.promisifyAll(_redis);

export const COUNTER_KEY = "count-the-things:counter";

/**
 * Initialize a Redis client
 */
export function initRedisClient(redis_url) {
  const client = redis.createClient(redis_url);
  client.on("error", function (error) {
    console.error("redis error: ", error);
  });
  return client;
}

/**
 * Set a counter key in redis server if it doesn't yet exist.
 */
export function initCounter(client) {
  client
    .getAsync(COUNTER_KEY)
    .then((val) => {
      if (val === null) {
        client.set(COUNTER_KEY, 0);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
