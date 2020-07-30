/** In-memory data store, with its interface. */

let count = 0;

function getCount() {
    return count;
}

function add(amount) {
    count += amount;
}

function subtract(amount) {
    count -= amount;
}

module.exports = {
    getCount: getCount,
    add: add,
    subtract: subtract,
}