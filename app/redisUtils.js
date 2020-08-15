const { promisifyAll } = require("bluebird");
const redis = promisifyAll(require("redis"));

const COUNTER_KEY = "count-the-things:counter";
const REDIS_URL = process.env.REDIS_URL || null;

// TODO: do this with some configs/env vars.
function initRedisClient() {
    const client = redis.createClient(REDIS_URL);
    client.on("error", function (error) {
        console.error("redis error: ", error);
    });
    return client;    
}

/**
 * Set a counter key in redis server if it doesn't yet exist.
 */
function initCounter(client) {
    const counter = client.getAsync(COUNTER_KEY).then((val) => {
        if (val === null) {
            client.set(COUNTER_KEY, 0);
        }
    }).catch((err) => { console.error(err) })
}


module.exports = {
    initRedisClient,
    initCounter,
    COUNTER_KEY,
}