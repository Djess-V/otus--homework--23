import "@testing-library/jest-dom";
import { Buffer } from 'node:buffer';
import WebSocket from "ws";
// eslint-disable-next-line import/no-relative-packages
import client from "../../../mocks/fakeClient";
import { handleEventMessage } from "./handleEventMessage";
import { addUser, createUser, updataUserRoomId } from "../../store/sliceUsers";
import store from "../../store/store";
import { addPlayerToTheRoom, addRoom, createPlayer, createRoom } from "../../store/sliceRooms";

// jest.mock('../../mocks/fakeClient', () => ({ send: jest.fn()
//     .mockImplementationOnce(() => true)
//     .mockImplementationOnce(() => { throw new Error("Error!")}) 
// }));

const sendSpyOn = jest.spyOn(client, "send");
const logSpyOn = jest.spyOn(window.console, "log");

describe("the first parameter to the function is not a string", () => {
  it("function worked correctly", () => {
    const buf = Buffer.from([1, 2, 3]);
    handleEventMessage(buf ,client as unknown as WebSocket);

    expect(logSpyOn).toHaveBeenCalledWith("Error receiving data in dispatchEvent! Data is not a string!");
  });

  it("check to see if the room list has been retrieved from the store", () => { 
    const rooms: string[] = [];
    [...Array(5)].forEach((_, i) => {
        const user = createUser("player", `user-${i}`, client as unknown as WebSocket);
        const room = createRoom(user.id);
        const player = createPlayer(user);

        rooms.push(room.roomId);

        store.dispatch(addUser(user));
        store.dispatch(updataUserRoomId({userId: user.id, roomId: room.roomId}));
        store.dispatch(addRoom(room));        
        store.dispatch(addPlayerToTheRoom({roomId: room.roomId, player}));
    });


    handleEventMessage(`{"getAllRooms": "true"}` , client as unknown as WebSocket);

    expect(sendSpyOn).toHaveBeenCalledWith(JSON.stringify({ rooms }));

    handleEventMessage(`{"getAllRooms": "false"}` , client as unknown as WebSocket);

    expect(sendSpyOn).toHaveBeenCalledWith(JSON.stringify({ rooms }));
  });
});
