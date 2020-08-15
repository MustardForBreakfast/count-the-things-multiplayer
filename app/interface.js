import { getCount, add, subtract } from "./store.js";

export function sendCount(connection) {
  getCount().then((count) => {
    const resp = {
      count,
    };
    connection.sendUTF(JSON.stringify(resp));
  });
}

export function sendCountToAll(server) {
  getCount().then((count) => {
    const resp = {
      count,
    };
    server.connections.forEach((conn) => {
      conn.sendUTF(JSON.stringify(resp));
    });
  });
}

export function handleMessage(message, server) {
  try {
    const content = JSON.parse(message.utf8Data);

    if (typeof content.value !== "number") {
      throw `invlaid message "value": ${content.value}`;
    }

    if (content.op === "add") {
      add(content.value).catch((err) => {
        console.error(`Error adding value ${content.value}: `, err);
      });
    } else if (content.op === "subtract") {
      subtract(content.value).catch((err) => {
        console.error(`Error subtracting value ${content.value}: `, err);
      });
    } else {
      throw `unrecognized op: ${content.op}`;
    }
    sendCountToAll(server);
  } catch (err) {
    console.log("invalid message content: ", err);
  }
}
