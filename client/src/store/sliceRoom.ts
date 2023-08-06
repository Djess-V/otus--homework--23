import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IPlayer {
  id: string;
  name: string;
  active: boolean;
}

type ICell = 0 | 1 | 2;

type IField = ICell[];

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  observerIds: string[];
  field: IField;
  roomCreator: string;
}

const initialState: Partial<IRoom> = {};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IRoom>) => action.payload,

    removeRoom: () => {},
  },
});

export const selectRoom = (state: RootState) => state.room;

export const { addRoom, removeRoom } = roomSlice.actions;

export default roomSlice.reducer;
