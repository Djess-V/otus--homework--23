import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import WebSocket from "ws";
import { RootState } from "./store";

export declare interface IUser {
  id: string;
  name: string;
  status: "player" | "observer";
  ws: WebSocket;
  roomId: string;
  active: boolean;
}

export const createUser = (
  status: "player" | "observer",
  name: string,
  ws: WebSocket,
  roomId: string,
): IUser => ({
  id: v4(),
  name,
  status,
  ws,
  roomId,
  active: false,
});

const initialState: IUser[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => {
      state.push(action.payload);
      return state;
    },
    removeUser: (state, action: PayloadAction<string>) =>
      state.filter((client) => client.id !== action.payload),
  },
});

export const selectUsersByIds = (
  state: RootState,
  playerIds: string[],
  observerIds: string[],
): IUser[] => {
  const users = [];

  for (const id of playerIds) {
    const user = state.users.find((item) => item.id === id) as IUser;

    users.push(user);
  }

  for (const id of observerIds) {
    const user = state.users.find((item) => item.id === id) as IUser;

    users.push(user);
  }

  return users;
};

export const { addUser, removeUser } = usersSlice.actions;

export default usersSlice.reducer;
