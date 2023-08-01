import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IConnection {
  state: boolean;
  message: string;
}

const initialState: IConnection = { state: false, message: "" };

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    openConnection: (state, action: PayloadAction<string>) => ({
      state: true,
      message: action.payload,
    }),
    closeConnection: () => ({ state: false, message: "Server went down!" }),
  },
});

export const selectConnection = (state: RootState) => state.connection;

export const { openConnection, closeConnection } = connectionSlice.actions;

export default connectionSlice.reducer;
