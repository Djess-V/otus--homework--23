import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { handleEventMessage } from "./handlers/handleEventMessage";
import { handleEventClose } from "./handlers/handleEventClose";
import { handleEventOpen } from "./handlers/handleEventOpen";

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

webSocketServer.on("connection", (ws) => {
  handleEventOpen(ws);
  ws.on("message", (m, isBinary) => {
    const message = isBinary ? m : m.toString();
    handleEventMessage(message, ws);
  });
  ws.on("close", () => {
    handleEventClose(ws);
  });
});

server.listen(port, () => {
  console.log(`Server start - http://31.129.97.32:${port}!`);
});
