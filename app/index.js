const express = require('express');
const path = require('path');
const ws = require('websocket');
const { configureWsConnection } = require('./interface');

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

function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed.
    return true;
}

function authenticate(){
    // TODO: put auth logic here.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin) || !authenticate()) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    try {
        const connection = request.accept('counter-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        configureWsConnection(wsServer, connection);
    }
    catch(err) {
        console.log(`connection failure: ${err}`)
    }

});