import { v4 } from "uuid";
import WebSocket from "ws";
import store from "./store/store";
import {
  IUser,
  addUser,
  createUser,
  selectUsersByIds,
} from "./store/sliceUsers";
import {
  addObserverToTheRoom,
  addPlayerToTheRoom,
  addRoom,
  createRoom,
  selectAllRoomsIds,
  selectAvailableRoomsIds,
  selectRoom,
} from "./store/sliceRooms";

interface IReceivedData {
  getAllRooms?: boolean;
  status?: "player" | "observer";
  name?: string;
  createRoom?: true;
  roomId?: string;
}

function transformUserToSend(user: IUser) {
  return {
    id: user.id,
    name: user.name,
    status: user.status,
    active: user.active,
  };
}

export const dispatchEvent = (message: WebSocket.Data, ws: WebSocket) => {
  if (typeof message !== "string") {
    return;
  }

  const data: IReceivedData = JSON.parse(message);

  if ("getAllRooms" in data) {
    if (data.getAllRooms) {
      ws.send(JSON.stringify({ rooms: selectAllRoomsIds(store.getState()) }));
    } else {
      ws.send(
        JSON.stringify({ rooms: selectAvailableRoomsIds(store.getState()) }),
      );
    }
  } else if (data.status === "player") {
    if ("createRoom" in data) {
      const roomId = v4();

      const player = createUser(data.status, data.name!, ws, roomId);

      store.dispatch(addUser(player));

      const userToSend = transformUserToSend(player);

      const room = createRoom(roomId, player.id);

      store.dispatch(addRoom(room));

      ws.send(JSON.stringify({ user: userToSend, room }));
    } else {
      const player = createUser(data.status, data.name!, ws, data.roomId!);

      store.dispatch(addUser(player));

      store.dispatch(
        addPlayerToTheRoom({ roomId: data.roomId!, playerId: player.id }),
      );

      const room = selectRoom(store.getState(), data.roomId!);

      const users = selectUsersByIds(
        store.getState(),
        room.playerIds,
        room.observerIds,
      );

      const userToSend = transformUserToSend(player);

      for (const client of users) {
        if (client.id === player.id) {
          client.ws.send(JSON.stringify({ user: userToSend, room }));
        } else {
          client.ws.send(JSON.stringify({ room }));
        }
      }
    }
  } else if (data.status === "observer") {
    const observer = createUser(data.status, "observer", ws, data.roomId!);
    store.dispatch(addUser(observer));
    store.dispatch(
      addObserverToTheRoom({ roomId: data.roomId!, observerId: observer.id }),
    );

    const room = selectRoom(store.getState(), data.roomId!);

    const userToSend = transformUserToSend(observer);

    ws.send(JSON.stringify({ user: userToSend, room }));
  }
};
