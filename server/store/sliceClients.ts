import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import WebSocket from "ws";
import { RootState } from "./store";

export declare interface IClient {
  id: string;
  name: string;
  status: "player" | "observer";
  ws: WebSocket;
  roomId: string;
  active: boolean;
}

export const createClient = (status: "player" | "observer", name: string, ws: WebSocket, roomId: string): IClient => (
    {
      id: v4(),
      name,
      status,
      ws,
      roomId,
      active: false
    }
  );

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

export const selectClients = (state: RootState, playerIds: string[], observerIds: string[]): IClient[] => {
  const clients = [];

  for (const id of playerIds) {
    const client = state.clients.find(item => item.id === id) as IClient;

    clients.push(client);
  }
  
  for (const id of observerIds) {
    const client = state.clients.find(item => item.id === id) as IClient;

    clients.push(client);
  }

  return clients;
}
export const { addClient, removeClient } = clientsSlice.actions;

export default clientsSlice.reducer;
