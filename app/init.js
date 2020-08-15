import { sendCount, handleMessage } from "./interface.js";
import { originIsAllowed, authenticate } from "./auth.js";

function configureWsConnection(server, connection) {
  connection.on("message", function (message) {
    try {
      if (message.type === "utf8") {
        console.log("Received Message: " + message.utf8Data);
        handleMessage(message, server);
      } else {
        throw `Unsupported message type: ${message.type}`;
      }
    } catch (err) {
      console.error("message failure: ", err);
    }
  });

  connection.on("close", () => {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });

  // Send the initial count to the new connection
  sendCount(connection);
}

export function configureWsServer(server) {
  server.on("request", function (request) {
    if (!originIsAllowed(request.origin) || !authenticate()) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log(
        new Date() + " Connection from origin " + request.origin + " rejected."
      );
      return;
    }

    try {
      const connection = request.accept("counter-protocol", request.origin);
      console.log(new Date() + " Connection accepted.");
      configureWsConnection(server, connection);
    } catch (err) {
      console.error(`connection failure: ${err}`);
    }
  });
}
