import { addPlayerToTheRoom, addRoom, createPlayer, createRoom, selectAvailableRoomByCreatorWithoutTwoPlayers, selectRoom } from "../../../store/sliceRooms";
import { selectUserById, selectUsersByIds, updataUserRoomId, updateUserActiveToTrue } from "../../../store/sliceUsers";
import store from "../../../store/store";
import { transformUserToSend } from "../../../util";
import { IReceivedData } from "../handleEventMessage";


export const handleNewGame = (data: IReceivedData) => {
    const room = selectAvailableRoomByCreatorWithoutTwoPlayers(
        store.getState(),
        data.passiveUserId!,
      );

      if (room) {
        return;
      }

      const newRoom = createRoom(data.activeUserId!, true);

      store.dispatch(addRoom(newRoom));

      store.dispatch(updateUserActiveToTrue(data.activeUserId!));

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
};