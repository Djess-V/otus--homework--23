import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type ICellState = 0 | 1 | 2;

type IFieldState = ICellState[];

export interface IRoom {
  roomId: string;
  playerIds: string[];
  observerIds: string[];
  currentFieldState: IFieldState;
}

const initialState: IRoom | NonNullable<unknown> = {};

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
