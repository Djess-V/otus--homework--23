import { Store } from "redux";
import { closeConnection, openConnection } from "../store/sliceConnection";
import { IRoom, addRoom } from "../store/sliceRoom";
import { addRooms } from "../store/sliceRooms";
import { IUser, addUser } from "../store/sliceUser";
import { IEndGame, addWinner } from "../store/sliceEndGame";
import { updateAgreement, updateOffer } from "../store/sliceOfferAndAgreement";

interface IReceivedData {
  user?: IUser;
  rooms?: string[];
  room?: IRoom;
  endGame?: IEndGame;
  offer?: true;
  agreement?: boolean;
}

interface ISentData {
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

export class WSManager {
  private socket: WebSocket;

  private store: Store;

  private receivedData: IReceivedData;

  constructor(url: string, store: Store) {
    this.socket = new WebSocket(url);
    this.store = store;
    this.receivedData = {};

    this.socket.addEventListener("open", this.bindHandleSocketEventOpen);

    this.socket.addEventListener("message", this.bindHandleSocketEventMessage);

    this.socket.addEventListener("close", this.bindHandleSocketEventClose);
  }

  handleSocketEventOpen = () => {
    console.log("Connection open!");
    this.store.dispatch(openConnection());
  };

  bindHandleSocketEventOpen = this.handleSocketEventOpen.bind(this);

  handleSocketEventMessage = (event: MessageEvent) => {
    try {
      this.receivedData = JSON.parse(event.data);

      console.dir(this.receivedData);

      if (this.receivedData.user) {
        this.store.dispatch(addUser(this.receivedData.user));
      }

      if (this.receivedData.rooms) {
        this.store.dispatch(addRooms(this.receivedData.rooms));
      }

      if (this.receivedData.room) {
        this.store.dispatch(addRoom(this.receivedData.room));
      }

      if (this.receivedData.endGame) {
        this.store.dispatch(addWinner(this.receivedData.endGame));
      }

      if (
        "offer" in this.receivedData &&
        this.receivedData.offer !== undefined
      ) {
        this.store.dispatch(updateOffer(this.receivedData.offer));
      }

      if (
        "agreement" in this.receivedData &&
        this.receivedData.agreement !== undefined
      ) {
        this.store.dispatch(updateAgreement(this.receivedData.agreement));
      }
    } catch (error) {
      console.log((error as unknown as Error).message);
    }
  };

  bindHandleSocketEventMessage = this.handleSocketEventMessage.bind(this);

  handleSocketEventClose = (event: CloseEvent) => {
    console.log(`Closed ${event.code}`);
    this.store.dispatch(closeConnection());
  };

  bindHandleSocketEventClose = this.handleSocketEventClose.bind(this);

  send = (message: ISentData) => {
    this.socket.send(JSON.stringify(message));
  };
}
