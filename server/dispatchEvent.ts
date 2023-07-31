import { v4 } from "uuid";
import WebSocket from "ws";
import store from "./store/store";
import {
  addUser,
  createUser,
  selectUserById,
  selectUsersByIds,
  updataUserActive,
} from "./store/sliceUsers";
import {
  addObserverToTheRoom,
  addPlayerToTheRoom,
  addRoom,
  createPlayer,
  createRoom,
  selectAllRoomsIds,
  selectAvailableRoomsIds,
  selectRoom,
  updateFirstPlayerActive,
} from "./store/sliceRooms";
import { transformUserToSend } from "./util";

interface IReceivedData {
  getAllRooms?: boolean;
  status?: "player" | "observer";
  name?: string;
  createRoom?: true;
  roomId?: string;
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

      const user = createUser(data.status, data.name!, ws, roomId);

      store.dispatch(addUser(user));

      let room = createRoom(roomId);

      store.dispatch(addRoom(room));

      const player = createPlayer(user);

      store.dispatch(addPlayerToTheRoom({ roomId, player }));

      room = selectRoom(store.getState(), roomId);

      const userToSend = transformUserToSend(user);

      ws.send(JSON.stringify({ user: userToSend, room }));
    } else {
      const user = createUser(data.status, data.name!, ws, data.roomId!);

      store.dispatch(addUser(user));

      const player = createPlayer(user);

      store.dispatch(addPlayerToTheRoom({ roomId: data.roomId!, player }));

      let room = selectRoom(store.getState(), data.roomId!);

      store.dispatch(updataUserActive(room.players[0].id));

      const firstUser = selectUserById(store.getState(), room.players[0].id);

      store.dispatch(updateFirstPlayerActive(data.roomId!));

      room = selectRoom(store.getState(), data.roomId!);

      const firstUserToSend = transformUserToSend(firstUser);

      firstUser.ws.send(JSON.stringify({ user: firstUserToSend }));

      const userToSend = transformUserToSend(user);

      const members = selectUsersByIds(
        store.getState(),
        room.players,
        room.observerIds,
      );

      for (const member of members) {
        if (member.id === player.id) {
          member.ws.send(JSON.stringify({ user: userToSend, room }));
        } else {
          member.ws.send(JSON.stringify({ room }));
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

    const members = selectUsersByIds(
      store.getState(),
      room.players,
      room.observerIds,
    );

    for (const member of members) {
      if (member.id === observer.id) {
        member.ws.send(JSON.stringify({ user: userToSend, room }));
      } else {
        member.ws.send(JSON.stringify({ room }));
      }
    }
  }
};
