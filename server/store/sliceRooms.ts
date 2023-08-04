import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
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
  availableForTwoPlayers: boolean;
  roomCreator: string;
}

export const createPlayer = (user: IUser): IPlayer => ({
  id: user.id,
  name: user.name,
  active: user.active,
});

export const createRoom = (
  userId: string,
  availableForTwoPlayers: boolean = false,
): IRoom => ({
  roomId: v4(),
  players: [],
  observerIds: [],
  field: [...initialField],
  available: true,
  availableForTwoPlayers,
  roomCreator: userId,
});

type State = IRoom[];

const initialState: State = [];

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

      if (room) {
        room.players.push(action.payload.player);
      }

      return state;
    },

    addObserverToTheRoom: (
      state,
      action: PayloadAction<IPayloadAddObserver>,
    ) => {
      const room = state.find((item) => item.roomId === action.payload.roomId);

      if (room) {
        room.observerIds.push(action.payload.observerId);
      }

      return state;
    },

    updatePlayersActive: (state, action: PayloadAction<string>) => {
      const room = state.find((item) => item.roomId === action.payload);

      if (room) {
        for (const player of room.players) {
          player.active = !player.active;
        }
      }

      return state;
    },

    updateFirstPlayerActive: (state, action: PayloadAction<string>) => {
      const room = state.find((item) => item.roomId === action.payload);

      if (room) {
        room.players[0].active = !room.players[0].active;
      }

      return state;
    },

    updateField: (state, action: PayloadAction<IPayloadUpdateField>) => {
      const room = state.find((item) => item.roomId === action.payload.roomId);

      if (room) {
        room.field[action.payload.index] = action.payload.value;
      }

      return state;
    },

    unlockRoom: (state, action: PayloadAction<string>) => {
      const room = state.find((item) => item.roomId === action.payload);

      if (room) {
        room.available = false;
      }

      return state;
    },

    removeRooms: () => [],
  },
});

export const selectRoom = (state: RootState, roomId: string) =>
  state.rooms.find((item) => item.roomId === roomId);

export const selectAllRoomsIds = (state: RootState) =>
  state.rooms.filter((item) => item.available).map((item) => item.roomId);

export const selectAvailableRoomsIds = (state: RootState) =>
  state.rooms
    .filter(
      (item) =>
        item.available &&
        !item.availableForTwoPlayers &&
        item.players.length === 1,
    )
    .map((item) => item.roomId);

export const selectFieldByRoomId = (state: RootState, roomId: string) => {
  const room = state.rooms.find((item) => item.roomId === roomId);

  if (room) {
    return room.field;
  }

  return room;
};

export const selectAvailableRoomByCreatorWithoutTwoPlayers = (
  state: RootState,
  userId: string,
) =>
  state.rooms.find(
    (item) =>
      item.roomCreator === userId &&
      item.available &&
      item.availableForTwoPlayers,
  );

export const {
  addRoom,
  addPlayerToTheRoom,
  addObserverToTheRoom,
  updateFirstPlayerActive,
  updatePlayersActive,
  updateField,
  unlockRoom,
  removeRooms,
} = roomsSlice.actions;

export default roomsSlice.reducer;
