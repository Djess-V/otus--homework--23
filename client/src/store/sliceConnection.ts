import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: boolean = false;

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    openConnection: () => true,
    closeConnection: () => false,
  },
});

export const selectConnection = (state: RootState) => state.connection;

export const { openConnection, closeConnection } = connectionSlice.actions;

export default connectionSlice.reducer;
