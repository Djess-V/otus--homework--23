import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebSocket from "ws";

export declare interface IClient {
  id: string;
  status: "player" | "observer";
  ws: WebSocket;
  partyId: string;
  active: boolean;
}

const initialState: IClient[] = [];

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<IClient>) => {
      state.push(action.payload);
      return state;
    },
    removeClient: (state, action: PayloadAction<string>) =>
      state.filter((client) => client.id !== action.payload),
  },
});

export const { addClient, removeClient } = clientsSlice.actions;

export default clientsSlice.reducer;
