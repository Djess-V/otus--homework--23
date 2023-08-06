import { addObserverToTheRoom, addPlayerToTheRoom, createPlayer, selectRoom } from "../../../store/sliceRooms";
import { selectUserById, selectUsersByIds, updataUserRoomId, updateUserActiveToFalse } from "../../../store/sliceUsers";
import store from "../../../store/store";
import { transformUserToSend } from "../../../util";
import { IReceivedData } from "../handleEventMessage";


export const handleAgreement = (data: IReceivedData) => {
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

    store.dispatch(updateUserActiveToFalse(data.activeUserId!));

    const user = selectUserById(store.getState(), data.activeUserId!);

    if (!user) {
      throw new Error("Second user not found when creating a replay!");
    }

    store.dispatch(updataUserRoomId({ userId: user.id, roomId: firstUser.roomId}));

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
};