/** Redis data store, with its interface. */
import { initRedisClient, initCounter, COUNTER_KEY } from "./redisUtils.js";

const client = initRedisClient(process.env.REDIS_URL || null);
initCounter(client);

export function getCount() {
  // Redis values come back as strings, so we need to parse count as an int.
  return client.getAsync(COUNTER_KEY).then((val) => parseInt(val, 10));
}

export function add(amount) {
  return client.incrbyAsync(COUNTER_KEY, amount);
}

export function subtract(amount) {
  return client.decrbyAsync(COUNTER_KEY, amount);
}
