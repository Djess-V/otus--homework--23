import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: string[] = [];

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRooms: (state, action: PayloadAction<string[]>) => action.payload,
    removeRooms: () => [],
  },
});

export const selectRooms = (state: RootState) => state.rooms;

export const { addRooms, removeRooms } = roomsSlice.actions;

export default roomsSlice.reducer;
