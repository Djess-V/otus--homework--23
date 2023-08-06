import WebSocket from "ws";
import { addPlayerToTheRoom, addRoom, createPlayer, createRoom, selectRoom } from "../../../store/sliceRooms";
import { addUser, createUser, updataUserRoomId } from "../../../store/sliceUsers";
import store from "../../../store/store";
import { transformUserToSend } from "../../../util";
import { IReceivedData } from "../handleEventMessage";

export const handleCreateRoom = (data: IReceivedData, ws: WebSocket) => {
    const user = createUser(data.status!, data.name!, ws as unknown as WebSocket);

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
};