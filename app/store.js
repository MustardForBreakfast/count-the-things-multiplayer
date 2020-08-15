/** Redis data store, with its interface. */
import { initRedisClient, initCounter, COUNTER_KEY } from "./redisUtils.js";

const client = initRedisClient(process.env.REDIS_URL || null);
initCounter(client);

export function getCount() {
  return client.getAsync(COUNTER_KEY);
}

export function add(amount) {
  return client.incrbyAsync(COUNTER_KEY, amount);
}

export function subtract(amount) {
  return client.decrbyAsync(COUNTER_KEY, amount);
}
