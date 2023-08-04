import WebSocket from "ws";
import store from "../../store/store";
import { handleCreateRoom } from "./handlers/handleCreateRoom";
import { handleStartGame } from "./handlers/handleStartGame";
import { handleAddObserver } from "./handlers/handleAddObserver";
import { handleStepGame } from "./handlers/handleStepGame";
import { handleNewGame } from "./handlers/handleNewGame";
import { handleAgreement } from "./handlers/handleAgreement";
import { selectAllRoomsIds, selectAvailableRoomsIds } from "../../store/sliceRooms";

export interface IReceivedData {
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

export const handleEventMessage = (message: WebSocket.Data, ws: WebSocket) => {
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
        handleCreateRoom(data, ws);
      } else {
       handleStartGame(data, ws);
      }
    } else if (data.status === "observer") {
      handleAddObserver(data, ws);
    } else if ("index" in data) {
      handleStepGame(data);
    } else if ("newGame" in data) {
      handleNewGame(data);
    } else if ("agreement" in data) {
      handleAgreement(data);
    }
  } catch (error) {
    console.log((error as unknown as Error).message);
  }
};
