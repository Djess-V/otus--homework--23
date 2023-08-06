import { IReceivedData } from "../handleEventMessage";
import store from "../../../store/store";
import { selectFieldByRoomId, selectRoom, unlockRoom, updateField, updatePlayersActive } from "../../../store/sliceRooms";
import { calculateWinner, transformUserToSend } from "../../../util";
import { selectUserById, selectUsersByIds, toggleUserActive } from "../../../store/sliceUsers";

export const handleStepGame = (data: IReceivedData) => {
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
};