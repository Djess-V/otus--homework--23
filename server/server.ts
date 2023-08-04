import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from "dotenv";
import { WebSocketServer } from "ws";
import { handleEventMessage } from "./eventHandlers/message/handleEventMessage";
import { handleEventClose } from "./eventHandlers/close/handleEventClose";
import { handleEventOpen } from "./eventHandlers/open/handleEventOpen";

config();

const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

const app = express();

try {
  const privateKeyPath = process.env.SSL_KEY as string;
  const publicKeyPath = process.env.SSL_CERT as string;
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const certificate = fs.readFileSync(publicKeyPath, "utf8");
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);

  const webSocketServerS = new WebSocketServer({ server: httpsServer });

  webSocketServerS.on("connection", (ws) => {
    handleEventOpen(ws);
    ws.on("message", (m, isBinary) => {
      const message = isBinary ? m : m.toString();
      handleEventMessage(message, ws);
    });
    ws.on("close", () =>  {
      handleEventClose(ws);
    });
  });

  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server listening on port ${httpsPort}`);
  });
} catch (ex) {
  console.error("Certificates not found. Not using HTTPS");
  console.error(ex);
}

const httpServer = http.createServer(app);

const webSocketServer = new WebSocketServer({ server: httpServer });

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

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server listening on port ${httpPort}`);
});
