import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import store from "./store/store";

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

const dispatchEvent = (message: WebSocket.Data, ws: WebSocket) => {
  if (typeof message !== "string") {
    return;
  }

  const data = JSON.parse(message);

  if (typeof data === "string" && data === "getParties") {
    ws.send(JSON.stringify({ parties: store.getState().parties }));
  }

  // webSocketServer.clients.forEach((client) =>
  //   client.send(JSON.stringify(store.getState().messages))
  // );
};

webSocketServer.on("connection", (ws) => {
  ws.on("message", (m, isBinary) => {
    const message = isBinary ? m : m.toString();
    dispatchEvent(message, ws);
  });
  ws.on("error", (e) => {
    console.log(e);
  });
});

server.listen(3001, () => {
  console.log(`Server start - http://localhost:3001`);
});
