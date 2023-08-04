import WebSocket from "ws";

export const handleEventOpen = (ws: WebSocket) => {
  try {
    ws.send(JSON.stringify({ connectionMessage: "Hello!" }));
  } catch (error) {
    console.log((error as unknown as Error).message);
  }
};
