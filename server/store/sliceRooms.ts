import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IUser } from "./sliceUsers";

export interface IPlayer {
  id: string;
  name: string;
  active: boolean;
}

export interface IPayloadUpdateField {
  roomId: string;
  index: number;
  value: 1 | 2;
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

export type IField = ICell[];

const initialField: IField = [...Array(9)].map(() => 0);

interface IRoom {
  roomId: string;
  players: IPlayer[];
  observerIds: string[];
  field: IField;
  available: boolean;
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
  available: true,
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

    updateField: (state, action: PayloadAction<IPayloadUpdateField>) => {
      const room = state.find(
        (item) => item.roomId === action.payload.roomId,
      ) as IRoom;

      room.field[action.payload.index] = action.payload.value;

      return state;
    },

    unlockRoom: (state, action: PayloadAction<string>) => {
      const room = state.find(
        (item) => item.roomId === action.payload,
      ) as IRoom;

      room.available = false;

      return state;
    },
  },
});

export const selectRoom = (state: RootState, roomId: string): IRoom =>
  state.rooms.find((item) => item.roomId === roomId) as IRoom;

export const selectAllRoomsIds = (state: RootState): string[] =>
  state.rooms.filter((item) => item.available).map((item) => item.roomId);

export const selectAvailableRoomsIds = (state: RootState): string[] =>
  state.rooms
    .filter((item) => item.available && item.players.length === 1)
    .map((item) => item.roomId);

export const selectFieldByRoomId = (state: RootState, roomId: string): IField =>
  (state.rooms.find((item) => item.roomId === roomId) as IRoom).field;

export const {
  addRoom,
  addPlayerToTheRoom,
  addObserverToTheRoom,
  updateFirstPlayerActive,
  updatePlayersActive,
  updateField,
  unlockRoom,
} = roomsSlice.actions;

export default roomsSlice.reducer;
