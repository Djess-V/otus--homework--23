import "@testing-library/jest-dom";
import WebSocket from "ws";
// eslint-disable-next-line import/no-relative-packages
import client from "../../../mocks/fakeClient";
import { handleEventClose } from "./handleEventClose";
import { addUser, createUser, removeUsers, updataUserRoomId } from "../../store/sliceUsers";
import store from "../../store/store";
import { addPlayerToTheRoom, addRoom, createPlayer, createRoom, removeRooms } from "../../store/sliceRooms";

describe("handleEventClose", () => {
  it("if there is no data in store, an error will be thrown", () => {
    const logSpyOn = jest.spyOn(window.console, "log");

    handleEventClose(client as unknown as WebSocket);

    expect(logSpyOn).toHaveBeenCalledWith(
      "When closing WS connection on user's initiative - user not found!",
    );
  });

  it("room not found", () => {
    const user = createUser("player", "Djess", client as unknown as WebSocket);

    store.dispatch(addUser(user));
    store.dispatch(updataUserRoomId({userId: user.id, roomId: "12345"}));

    const logSpyOn = jest.spyOn(window.console, "log");

    handleEventClose(client as unknown as WebSocket);

    expect(logSpyOn).toHaveBeenCalledWith(
      "When closing WS connection on user's initiative - room not found!",
    );

    store.dispatch(removeUsers());
    store.dispatch(removeRooms());

    expect(store.getState().users.length).toBe(0);
    expect(store.getState().rooms.length).toBe(0);
  });

  it("function worked correctly", () => {
    const user = createUser("player", "Djess", client as unknown as WebSocket);
    const room = createRoom(user.id);
    const player = createPlayer(user);

    store.dispatch(addUser(user));
    store.dispatch(updataUserRoomId({userId: user.id, roomId: room.roomId}));
    store.dispatch(addRoom(room));
    
    store.dispatch(addPlayerToTheRoom({roomId: room.roomId, player}));
    const sendSpyOn = jest.spyOn(client, "send");

    handleEventClose(client as unknown as WebSocket);

    expect(sendSpyOn).toHaveBeenCalledTimes(1);
  });
});
