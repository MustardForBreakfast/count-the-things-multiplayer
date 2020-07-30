const express = require('express');
const path = require('path');
const ws = require('websocket');
const { getCount, add, subtract } = require('./store');

const WebSocketServer = ws.server;

// Serve static assets (e.g. html) via normal ol' http
const app = express();
app.use(express.static(__dirname + '/../client'));

// Start an http server
const port = 8765;
const server = app.listen(port, () => {
    console.log(`listening http://localhost:${port}`);
});

// Do the socket dance
const wsServer = new WebSocketServer({
    httpServer: server
});

function sendCount(connection) {
    const resp = {
        count: getCount(),
    }
    connection.sendUTF(JSON.stringify(resp));
}

function sendCountToAll() {
    const resp = {
        count: getCount(),
    }
    wsServer.connections.forEach(
        conn => {
            conn.sendUTF(JSON.stringify(resp));
        }
    )
}

function handleMessage(message, connection) {
    try {
        const content = JSON.parse(message.utf8Data);

        if(typeof content.value !== 'number') {
            throw `invlaid message "value": ${content.value}`;
        }

        if(content.op === 'add'){
            add(content.value);
        } else if(content.op === 'subtract'){
            subtract(content.value);
        } else {
            throw `unrecognized op: ${content.op}`;
        }
        sendCountToAll();
    }
    catch(err) {
        console.log('invalid message content: ', err)
    }
}

function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    try {
        const connection = request.accept('counter-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');

        connection.on('message', function (message) {
            try {
                if (message.type === 'utf8') {
                    console.log('Received Message: ' + message.utf8Data);
                    handleMessage(message, connection)
                } else {
                    throw `Unsupported message type: ${message.type}`
                }
            } catch(err) {
                console.log('message failure: ', err)
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });

        // Send the initial count to the new connection
        sendCount(connection);
    }
    catch(err) {
        console.log(`connection failure: ${err}`)
    }

});