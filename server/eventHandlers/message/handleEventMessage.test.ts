import "@testing-library/jest-dom";
import { Buffer } from 'node:buffer';
import WebSocket from "ws";
// eslint-disable-next-line import/no-relative-packages
import client from "../../../mocks/fakeClient";
import { handleEventMessage } from "./handleEventMessage";
import { addUser, createUser, selectUserById, updataUserRoomId } from "../../store/sliceUsers";
import store from "../../store/store";
import { addPlayerToTheRoom, addRoom, createPlayer, createRoom, selectRoom, updateField } from "../../store/sliceRooms";
import { transformUserToSend } from "../../util";

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

  it("check the room creation handler and the first user", () => { 
    handleEventMessage(`{"status": "player", "name": "Djess", "createRoom": "true"}` , client as unknown as WebSocket);

    expect(store.getState().users.length).toBe(6);

    const user = store.getState().users[5];

    const userToSend = transformUserToSend(user);

    const room = selectRoom(store.getState(), user.roomId);

    expect(sendSpyOn).toHaveBeenCalledWith(JSON.stringify({ user: userToSend, room }));
  });

  describe("check the handler for creating a second player and starting a game", () => {

    it("with a non-existent roomId", () => { 
      handleEventMessage(`{"status": "player", "name": "Greg", "roomId": "roomId"}` , client as unknown as WebSocket);

      expect(logSpyOn).toHaveBeenCalledWith("When creating a second user, no room is found before updating the active field!");
    });

    it("with a correct roomId", () => { 
      const { roomId } = store.getState().users[5];

      const message = JSON.stringify({status: "player", name: "Greg", roomId});

      handleEventMessage(message , client as unknown as WebSocket);

      expect(sendSpyOn).toHaveBeenCalledTimes(1);
    });
  });

  it("check the observer creation handler", () => { 
      const { roomId } = store.getState().users[5];

      const message = JSON.stringify({status: "observer", name: "", roomId});

      handleEventMessage(message , client as unknown as WebSocket);

      expect(store.getState().users.length).toBe(9);

      expect(store.getState().users[8].name).toBe("observer");
    });

  describe("checking the execution of the game step handler", () => {
    it("invalid roomId", () => {   
      const activeUserId = store.getState().users[5].id;

      const passiveUserId = store.getState().users[6].id;

      const message = JSON.stringify({roomId: "Error!",  activeUserId, passiveUserId, index: 4, value: 1});

      handleEventMessage(message , client as unknown as WebSocket);

      expect(logSpyOn).toHaveBeenCalledWith("Field not found!");
    });    

    it("correct execution", () => { 
      const { roomId } = store.getState().users[5];

      const activeUserId = store.getState().users[5].id;

      const passiveUserId = store.getState().users[6].id;

      const message = JSON.stringify({roomId,  activeUserId, passiveUserId, index: 4, value: 1});

      handleEventMessage(message , client as unknown as WebSocket);

      expect(selectRoom(store.getState(), roomId)?.field[4]).toBe(1);
    });

    it("all cells are filled", () => {
      const { roomId } = store.getState().users[5];
      
      [...Array(9)].forEach((_, index) => {
        store.dispatch(updateField({ roomId, index, value: index % 2 === 0 ? 1 : 2}))
      });

      const activeUserId = store.getState().users[5].id;

      const passiveUserId = store.getState().users[6].id;      

      const message = JSON.stringify({roomId,  activeUserId, passiveUserId, index: 4, value: 1});

      handleEventMessage(message , client as unknown as WebSocket);

      expect(selectRoom(store.getState(), roomId)?.available).toBe(false);
    });
  });

  it("check the new game creation handler", () => {
    const { roomId } = store.getState().users[5];

    const activeUserId = store.getState().users[5].id;

    const passiveUserId = store.getState().users[7].id;

    const message = JSON.stringify({roomId,  activeUserId, passiveUserId, newGame: true});

    handleEventMessage(message , client as unknown as WebSocket);

    expect(store.getState().rooms.filter(item => item.availableForTwoPlayers).length).toBe(1);
  });

  it("checking the consent handler for a new game", () => {
    const { roomId } = store.getState().users[7];

    const activeUserId = store.getState().users[7].id;

    const passiveUserId = store.getState().users[5].id;

    const message = JSON.stringify({roomId,  activeUserId, passiveUserId, agreement: true});

    handleEventMessage(message , client as unknown as WebSocket);

    expect(selectUserById(store.getState(), activeUserId)?.roomId).toBe(selectUserById(store.getState(), passiveUserId)?.roomId);
  });
  
});
