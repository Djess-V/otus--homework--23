import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import store from "./store/store";
import { addMessage } from "./store/sliceMessages";

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

const dispatchEvent = (message: WebSocket.Data) => {
  if (typeof message !== "string") {
    return;
  }

  store.dispatch(addMessage(message));

  webSocketServer.clients.forEach((client) =>
    client.send(JSON.stringify(store.getState().messages)),
  );
};

webSocketServer.on("connection", (ws) => {
  ws.on("message", (m, isBinary) => {
    const message = isBinary ? m : m.toString();
    dispatchEvent(message);
  });
  ws.on("error", (e) => {
    console.log(e);
  });
});

server.listen(3001, () => {
  console.log(`Server start - http://localhost:3001`);
});
