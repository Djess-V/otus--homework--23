import WebSocket from "ws";
import store from "./store/store";
import {
  addUser,
  createUser,
  selectUserById,
  selectUsersByIds,
  toggleUserActive,
  updataUserRoomId,
  updateUserActiveToFalse,
  updateUserActiveToTrue,
} from "./store/sliceUsers";
import {
  addObserverToTheRoom,
  addPlayerToTheRoom,
  addRoom,
  createPlayer,
  createRoom,
  selectAllRoomsIds,
  selectAvailableRoomByCreatorWithoutTwoPlayers,
  selectAvailableRoomsIds,
  selectFieldByRoomId,
  selectRoom,
  unlockRoom,
  updateField,
  updateFirstPlayerActive,
  updatePlayersActive,
} from "./store/sliceRooms";
import { calculateWinner, transformUserToSend } from "./util";

interface IReceivedData {
  getAllRooms?: boolean;
  status?: "player" | "observer";
  name?: string;
  createRoom?: true;
  roomId?: string;
  index?: number;
  value?: 1 | 2;
  activeUserId?: string;
  passiveUserId?: string;
  newGame?: boolean;
  roomCreator?: string;
  agreement?: boolean;
}

export const dispatchEvent = (message: WebSocket.Data, ws: WebSocket) => {
  try {
    if (typeof message !== "string") {
      throw new Error(
        "Error receiving data in dispatchEvent! Data is not a string!",
      );
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
        const user = createUser(data.status, data.name!, ws);

        store.dispatch(addUser(user));

        const room = createRoom(user.id);

        store.dispatch(addRoom(room));

        store.dispatch(
          updataUserRoomId({ userId: user.id, roomId: room.roomId }),
        );

        const player = createPlayer(user);

        store.dispatch(addPlayerToTheRoom({ roomId: room.roomId, player }));

        const currentRoom = selectRoom(store.getState(), room.roomId);

        if (!currentRoom) {
          throw new Error("No room found when creating the first user!");
        }

        const userToSend = transformUserToSend(user);

        ws.send(JSON.stringify({ user: userToSend, room: currentRoom }));
      } else {
        const user = createUser(data.status, data.name!, ws);

        store.dispatch(addUser(user));

        store.dispatch(
          updataUserRoomId({ userId: user.id, roomId: data.roomId! }),
        );

        const player = createPlayer(user);

        store.dispatch(addPlayerToTheRoom({ roomId: data.roomId!, player }));

        const roomBeforeUpdateActive = selectRoom(
          store.getState(),
          data.roomId!,
        );

        if (!roomBeforeUpdateActive) {
          throw new Error(
            "When creating a second user, no room is found before updating the active field!",
          );
        }

        store.dispatch(toggleUserActive(roomBeforeUpdateActive.players[0].id));

        const firstUser = selectUserById(
          store.getState(),
          roomBeforeUpdateActive.players[0].id,
        );

        if (!firstUser) {
          throw new Error("First user not found!");
        }

        store.dispatch(updateFirstPlayerActive(data.roomId!));

        const roomAfterUpdateActive = selectRoom(
          store.getState(),
          data.roomId!,
        );

        if (!roomAfterUpdateActive) {
          throw new Error(
            "When creating a second user, room not found after updating active field!",
          );
        }

        const firstUserToSend = transformUserToSend(firstUser);

        firstUser.ws.send(JSON.stringify({ user: firstUserToSend }));

        const userToSend = transformUserToSend(user);

        const members = selectUsersByIds(
          store.getState(),
          roomAfterUpdateActive.players,
          roomAfterUpdateActive.observerIds,
        );

        for (const member of members) {
          if (member.id === player.id) {
            member.ws.send(
              JSON.stringify({ user: userToSend, room: roomAfterUpdateActive }),
            );
          } else {
            member.ws.send(JSON.stringify({ room: roomAfterUpdateActive }));
          }
        }
      }
    } else if (data.status === "observer") {
      const observer = createUser(data.status, "observer", ws);
      store.dispatch(addUser(observer));

      store.dispatch(
        updataUserRoomId({ userId: observer.id, roomId: data.roomId! }),
      );

      store.dispatch(
        addObserverToTheRoom({ roomId: data.roomId!, observerId: observer.id }),
      );

      const room = selectRoom(store.getState(), data.roomId!);

      if (!room) {
        throw new Error("No room found when creating an observer!");
      }

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
    } else if ("index" in data) {
      store.dispatch(
        updateField({
          index: data.index!,
          value: data.value!,
          roomId: data.roomId!,
        }),
      );

      const field = selectFieldByRoomId(store.getState(), data.roomId!);

      if (!field) {
        throw new Error("Field not found!");
      }

      const winTest = calculateWinner(field);

      if (winTest) {
        store.dispatch(unlockRoom(data.roomId!));

        const room = selectRoom(store.getState(), data.roomId!);

        if (!room) {
          throw new Error("No room found when winning!");
        }

        const members = selectUsersByIds(
          store.getState(),
          room.players,
          room.observerIds,
        );

        for (const member of members) {
          member.ws.send(
            JSON.stringify({
              endGame: { winner: data.activeUserId!, mix: winTest },
              room,
            }),
          );
        }

        return;
      }

      let room = selectRoom(store.getState(), data.roomId!);

      if (!room) {
        throw new Error("Room before changing active players not found!");
      }

      if (!room.field.includes(0)) {
        store.dispatch(unlockRoom(data.roomId!));

        const members = selectUsersByIds(
          store.getState(),
          room.players,
          room.observerIds,
        );

        for (const member of members) {
          member.ws.send(
            JSON.stringify({
              endGame: { winner: "", mix: [] },
              room,
            }),
          );
        }
      }

      store.dispatch(toggleUserActive(data.activeUserId!));

      store.dispatch(toggleUserActive(data.passiveUserId!));

      store.dispatch(updatePlayersActive(data.roomId!));

      room = selectRoom(store.getState(), data.roomId!);

      if (!room) {
        throw new Error("Room not found after changing active players!");
      }

      const activeUser = selectUserById(store.getState(), data.activeUserId!);

      if (!activeUser) {
        throw new Error("Active user not found!");
      }

      const passiveUser = selectUserById(store.getState(), data.passiveUserId!);

      if (!passiveUser) {
        throw new Error("Passive user not found!");
      }

      const activeUserToSend = transformUserToSend(activeUser);

      const passiveUserToSend = transformUserToSend(passiveUser);

      const members = selectUsersByIds(
        store.getState(),
        room.players,
        room.observerIds,
      );

      for (const member of members) {
        if (member.id === data.activeUserId) {
          member.ws.send(JSON.stringify({ user: activeUserToSend, room }));
        } else if (member.id === data.passiveUserId) {
          member.ws.send(JSON.stringify({ user: passiveUserToSend, room }));
        } else {
          member.ws.send(JSON.stringify({ room }));
        }
      }
    } else if ("newGame" in data) {
      const room = selectAvailableRoomByCreatorWithoutTwoPlayers(
        store.getState(),
        data.passiveUserId!,
      );

      if (room) {
        return;
      }

      const newRoom = createRoom(data.activeUserId!, true);

      store.dispatch(addRoom(newRoom));

      if (data.roomCreator === data.activeUserId) {
        store.dispatch(updateUserActiveToFalse(data.activeUserId!));
      } else {
        store.dispatch(updateUserActiveToTrue(data.activeUserId!));
      }

      store.dispatch(
        updataUserRoomId({
          userId: data.activeUserId!,
          roomId: newRoom.roomId,
        }),
      );

      const user = selectUserById(store.getState(), data.activeUserId!);

      if (!user) {
        throw new Error("First user not found when creating a replay!");
      }

      const player = createPlayer(user);

      store.dispatch(addPlayerToTheRoom({ roomId: newRoom.roomId, player }));

      const userToSend = transformUserToSend(user);

      const prevRoom = selectRoom(store.getState(), data.roomId!);

      if (!prevRoom) {
        throw new Error(
          "When creating a repeated game, the previous room is not found!",
        );
      }

      const members = selectUsersByIds(
        store.getState(),
        prevRoom.players,
        prevRoom.observerIds,
      );

      for (const member of members) {
        if (member.id === data.activeUserId) {
          member.ws.send(
            JSON.stringify({
              user: userToSend,
              agreement: false,
            }),
          );
        } else if (member.id === data.passiveUserId) {
          member.ws.send(JSON.stringify({ offer: true, agreement: false }));
        } else {
          member.ws.send(JSON.stringify({ agreement: false }));
        }
      }
    } else if ("agreement" in data) {
      const firstUser = selectUserById(store.getState(), data.passiveUserId!);

      if (!firstUser) {
        throw new Error(
          "The first player is not found when processing consent!",
        );
      }

      const roomBeforeUpdateObservers = selectRoom(
        store.getState(),
        firstUser.roomId,
      );

      if (!roomBeforeUpdateObservers) {
        throw new Error("No room found before observers update by agreement!");
      }

      if (data.roomCreator === data.activeUserId) {
        store.dispatch(updateUserActiveToFalse(data.activeUserId!));
      } else {
        store.dispatch(updateUserActiveToTrue(data.activeUserId!));
      }

      const user = selectUserById(store.getState(), data.activeUserId!);

      if (!user) {
        throw new Error("Second user not found when creating a replay!");
      }

      const player = createPlayer(user);

      store.dispatch(
        addPlayerToTheRoom({
          roomId: roomBeforeUpdateObservers.roomId,
          player,
        }),
      );

      const userToSend = transformUserToSend(user);

      const prevRoom = selectRoom(store.getState(), data.roomId!);

      if (!prevRoom) {
        throw new Error(
          "When creating a repeated game, the previous room is not found!",
        );
      }

      for (const observerId of prevRoom.observerIds) {
        store.dispatch(
          updataUserRoomId({
            userId: observerId,
            roomId: roomBeforeUpdateObservers.roomId,
          }),
        );

        store.dispatch(
          addObserverToTheRoom({
            roomId: roomBeforeUpdateObservers.roomId,
            observerId,
          }),
        );
      }

      const roomAfterUpdateObservers = selectRoom(
        store.getState(),
        roomBeforeUpdateObservers.roomId,
      );

      if (!roomAfterUpdateObservers) {
        throw new Error("No room found before observers update!");
      }

      const members = selectUsersByIds(
        store.getState(),
        roomAfterUpdateObservers.players,
        roomAfterUpdateObservers.observerIds,
      );

      const endGame = {};

      for (const member of members) {
        if (member.id === data.activeUserId) {
          member.ws.send(
            JSON.stringify({
              user: userToSend,
              room: roomAfterUpdateObservers,
              agreement: true,
              offer: false,
              endGame,
            }),
          );
        } else if (member.id === data.passiveUserId) {
          member.ws.send(
            JSON.stringify({
              room: roomAfterUpdateObservers,
              agreement: true,
              endGame,
            }),
          );
        } else {
          const observer = selectUserById(store.getState(), member.id);

          if (!observer) {
            throw new Error(
              `Observer with id: ${member.id} not found when creating a replay!`,
            );
          }
          const observerToSend = transformUserToSend(observer);

          member.ws.send(
            JSON.stringify({
              user: observerToSend,
              room: roomAfterUpdateObservers,
              agreement: true,
              endGame,
            }),
          );
        }
      }
    }
  } catch (error) {
    console.log((error as unknown as Error).message);
  }
};
