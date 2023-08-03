import https from "https";
import fs from "fs";
import { WebSocketServer } from "ws";
import { handleEventMessage } from "./handlers/handleEventMessage";
import { handleEventClose } from "./handlers/handleEventClose";
import { handleEventOpen } from "./handlers/handleEventOpen";

const port = process.env.PORT || 3001;

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("csr.pem"),
};

const server = https.createServer(options);

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
  console.log(`Server start - https://31.129.97.32:${port}!`);
});
