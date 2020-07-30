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

function configureWsConnection(server, connection){
    connection.on('message', function (message) {
        try {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                handleMessage(message, server);
            } else {
                throw `Unsupported message type: ${message.type}`
            }
        } catch (err) {
            console.log('message failure: ', err)
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    // Send the initial count to the new connection
    sendCount(connection);
}

function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed.
    return true;
}

function authenticate() {
    // TODO: put auth logic here.
    return true;
}

function initWsConnection(server){
    server.on('request', function (request) {
        if (!originIsAllowed(request.origin) || !authenticate()) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        try {
            const connection = request.accept('counter-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            configureWsConnection(server, connection);
        }
        catch (err) {
            console.log(`connection failure: ${err}`)
        }
    });
}

module.exports = {
    sendCount: sendCount,
    sendCountToAll: sendCountToAll,
    handleMessage: handleMessage,
    configureWsConnection: configureWsConnection,
    initWsConnection: initWsConnection,
}