import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IUser } from "./sliceUsers";

export interface IPlayer {
  id: string;
  name: string;
  active: boolean;
}

interface IPayloadAddPlayer {
  roomId: string;
  player: IPlayer;
}

interface IPayloadAddObserver {
  roomId: string;
  observerId: string;
}

type ICell = 0 | 1 | 2;

type IField = ICell[];

const initialField: IField = [...Array(9)].map(() => 0);

interface IRoom {
  roomId: string;
  players: IPlayer[];
  observerIds: string[];
  field: IField;
}

export const createPlayer = (user: IUser): IPlayer => ({
  id: user.id,
  name: user.name,
  active: user.active,
});

export const createRoom = (roomId: string): IRoom => ({
  roomId,
  players: [],
  observerIds: [],
  field: [...initialField],
});

const initialState: IRoom[] = [];

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IRoom>) => {
      state.push(action.payload);
      return state;
    },

    addPlayerToTheRoom: (state, action: PayloadAction<IPayloadAddPlayer>) => {
      const room = state.find((item) => item.roomId === action.payload.roomId);

      room?.players.push(action.payload.player);

      return state;
    },

    addObserverToTheRoom: (
      state,
      action: PayloadAction<IPayloadAddObserver>,
    ) => {
      const room = state.find((item) => item.roomId === action.payload.roomId);

      room?.observerIds.push(action.payload.observerId);

      return state;
    },

    updatePlayersActive: (state, action: PayloadAction<string>) => {
      const room = state.find(
        (item) => item.roomId === action.payload,
      ) as IRoom;

      for (const player of room.players) {
        player.active = !player.active;
      }

      return state;
    },

    updateFirstPlayerActive: (state, action: PayloadAction<string>) => {
      const room = state.find(
        (item) => item.roomId === action.payload,
      ) as IRoom;

      room.players[0].active = !room.players[0].active;

      return state;
    },
  },
});

export const selectRoom = (state: RootState, roomId: string): IRoom =>
  state.rooms.find((item) => item.roomId === roomId) as IRoom;

export const selectAllRoomsIds = (state: RootState): string[] =>
  state.rooms.map((item) => item.roomId);

export const selectAvailableRoomsIds = (state: RootState): string[] =>
  state.rooms
    .filter((item) => item.players.length === 1)
    .map((item) => item.roomId);

export const {
  addRoom,
  addPlayerToTheRoom,
  addObserverToTheRoom,
  updateFirstPlayerActive,
  updatePlayersActive,
} = roomsSlice.actions;

export default roomsSlice.reducer;
