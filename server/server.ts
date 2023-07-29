import http from "http";
import express from "express";
import { v4 } from "uuid";
import WebSocket, { WebSocketServer } from "ws";
import store from "./store/store";
import { addClient, createClient, selectClients } from "./store/sliceClients";
import { addObserverToTheRoom, addPlayerToTheRoom, addRoom, createRoom, selectAvailableRoom, selectRoom } from "./store/sliceRooms";

interface IWsServerData {
  getAllRooms?: boolean,
  status?: "player" | "observer",
  name?: string,
  createRoom?: true,
  roomId?: string,
}

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

const dispatchEvent = (message: WebSocket.Data, ws: WebSocket) => {
  if (typeof message !== "string") {
    return;
  }

  const data: IWsServerData = JSON.parse(message);

  if ("getAllRooms" in data) {
    if (data.getAllRooms) {
      ws.send(JSON.stringify({ rooms: store.getState().rooms }));
    } else {
      ws.send(JSON.stringify({ rooms: selectAvailableRoom(store.getState())  }));
    }    
  } else if (data.status === "player") {
    if ("createRoom" in data) {
      const roomId = v4();

      const player = createClient(data.status, data.name!, ws, roomId);

      store.dispatch(addClient(player));

      const room = createRoom(roomId, player.id);
      
      store.dispatch(addRoom(room));   

      ws.send(JSON.stringify({ room }));   
    } else {
      const player = createClient(data.status, data.name!, ws, data.roomId!);

      store.dispatch(addClient(player));

      store.dispatch(addPlayerToTheRoom({ roomId: data.roomId!, playerId: player.id }));

      ws.send(JSON.stringify({ room: selectRoom(store.getState(), data.roomId!) }));

      const room = selectRoom(store.getState(), data.roomId!);

      const clients = selectClients(store.getState(), room.playerIds, room.observerIds);
      
      for (const client of clients) {
        client.ws.send(JSON.stringify({ start: true }))
      }
    }

    
    
  } else if (data.status === "observer") {
    const observer = createClient(data.status, "observer", ws, data.roomId!);
    store.dispatch(addClient(observer));
    store.dispatch(addObserverToTheRoom({ roomId: data.roomId!, observerId: observer.id }));
    ws.send(JSON.stringify({room: selectRoom(store.getState(), data.roomId!)}));
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
