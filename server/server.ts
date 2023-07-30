import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { dispatchEvent } from "./dispatchEvent";

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

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
