import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { handleEventMessage } from "./handlers/handleEventMessage";
import { handleEventClose } from "./handlers/handleEventClose";
import { handleEventOpen } from "./handlers/handleEventOpen";

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

webSocketServer.on("connection", (ws) => {
  handleEventOpen(ws);
  ws.on("message", (m, isBinary) => {
    const message = isBinary ? m : m.toString();
    handleEventMessage(message, ws);
  });
  ws.on("error", (e) => {
    console.log(e);
  });
  ws.on("close", () => {
    handleEventClose(ws);
  });
});

server.listen(3001, () => {
  console.log(`Server start - http://localhost:3001`);
});
