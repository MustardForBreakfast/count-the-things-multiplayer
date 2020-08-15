const { promisifyAll } = require("bluebird");
const redis = promisifyAll(require("redis"));

const COUNTER_KEY = "count-the-things:counter";

/**
 * Initialize a Redis client
 */
function initRedisClient(redis_url) {
  const client = redis.createClient(redis_url);
  client.on("error", function (error) {
    console.error("redis error: ", error);
  });
  return client;
}

/**
 * Set a counter key in redis server if it doesn't yet exist.
 */
function initCounter(client) {
  const counter = client
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

module.exports = {
  initRedisClient,
  initCounter,
  COUNTER_KEY,
};
