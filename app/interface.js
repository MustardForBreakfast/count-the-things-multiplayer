const { getCount, add, subtract } = require('./store');

function sendCount(connection) {
    const resp = {
        count: getCount(),
    }
    connection.sendUTF(JSON.stringify(resp));
}

function sendCountToAll(server) {
    const resp = {
        count: getCount(),
    }
    server.connections.forEach(
        conn => {
            conn.sendUTF(JSON.stringify(resp));
        }
    )
}

function handleMessage(message, server) {
    try {
        const content = JSON.parse(message.utf8Data);

        if (typeof content.value !== 'number') {
            throw `invlaid message "value": ${content.value}`;
        }

        if (content.op === 'add') {
            add(content.value);
        } else if (content.op === 'subtract') {
            subtract(content.value);
        } else {
            throw `unrecognized op: ${content.op}`;
        }
        sendCountToAll(server);
    }
    catch (err) {
        console.log('invalid message content: ', err)
    }
}


module.exports = {
    sendCount: sendCount,
    sendCountToAll: sendCountToAll,
    handleMessage: handleMessage,
}