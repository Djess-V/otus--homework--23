import { WebSocketServer } from "ws";
import { handleEventMessage } from "./handlers/handleEventMessage";
import { handleEventClose } from "./handlers/handleEventClose";
import { handleEventOpen } from "./handlers/handleEventOpen";

const webSocketServer = new WebSocketServer({ port: 3001 });

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
