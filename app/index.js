const express = require("express");
const path = require("path");
const WebSocketServer = require("websocket").server;
const { configureWsServer } = require("./init");
const { expressCspHeader, SELF, NONE } = require("express-csp-header");

const port = process.env.PORT || 8765;
const hostname = process.env.HOSTNAME || `localhost:${port}`;

const app = express();

// Configure CSP behavior.
app.use(
  expressCspHeader({
    directives: {
      "default-src": [SELF, `ws://${hostname}`, `wss://${hostname}`],
      "script-src": [SELF],
      "style-src": [SELF],
      "img-src": [SELF],
      "worker-src": [NONE],
      "block-all-mixed-content": true,
    },
  })
);

// Serve static assets (e.g. html) via normal ol' http.
app.use(express.static(__dirname + "/../client"));

// Start an http(s) server.
const server = app.listen(port, () => {
  console.log(`listening at ${hostname}, port ${port}`);
});

// Do the socket dance.
configureWsServer(
  new WebSocketServer({
    httpServer: server,
  })
);
