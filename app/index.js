const express = require('express');
const path = require('path');
const WebSocketServer = require('websocket').server;
const { configureWsServer } = require('./init');

// Serve static assets (e.g. html) via normal ol' http
const app = express();
app.use(express.static(__dirname + '/../client'));

// Start an http server
const port = process.env.PORT || 8765
const server = app.listen(port, () => {
    console.log(`listening http://localhost:${port}`);
});

// Do the socket dance
configureWsServer(
    new WebSocketServer({
        httpServer: server
    })
);