import WebSocket from "ws";
import { addUser, createUser, selectUserById, selectUsersByIds, toggleUserActive, updataUserRoomId } from "../../../store/sliceUsers";
import { IReceivedData } from "../handleEventMessage";
import store from "../../../store/store";
import { addPlayerToTheRoom, createPlayer, selectRoom, updateFirstPlayerActive } from "../../../store/sliceRooms";
import { transformUserToSend } from "../../../util";


export const handleStartGame = (data: IReceivedData, ws: WebSocket) => {
    const user = createUser(data.status!, data.name!, ws as unknown as WebSocket);

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
};