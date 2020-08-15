import express from "express";
import websocket from "websocket";
import csp from "express-csp-header";
import path from "path";
import { configureWsServer } from "./init.js";

const { expressCspHeader, SELF, NONE } = csp;
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
app.use(express.static(path.resolve("client")));

// Start an http(s) server.
const server = app.listen(port, () => {
  console.log(`listening at ${hostname}, port ${port}`);
});

// Do the socket dance.
configureWsServer(
  new websocket.server({
    httpServer: server,
  })
);
