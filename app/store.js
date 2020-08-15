/** Redis data store, with its interface. */
const { initRedisClient, initCounter, COUNTER_KEY } = require("./redisUtils");

const client = initRedisClient(process.env.REDIS_URL || null);
initCounter(client);

function getCount() {
  return client.getAsync(COUNTER_KEY);
}

function add(amount) {
  return client.incrbyAsync(COUNTER_KEY, amount);
}

function subtract(amount) {
  return client.decrbyAsync(COUNTER_KEY, amount);
}

module.exports = {
  getCount: getCount,
  add: add,
  subtract: subtract,
};
