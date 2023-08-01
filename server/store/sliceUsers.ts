import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import WebSocket from "ws";
import { RootState } from "./store";
import type { IPlayer } from "./sliceRooms";

export interface IUser {
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
): IUser => ({
  id: v4(),
  name,
  status,
  ws,
  roomId: "",
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
    toggleUserActive: (state, action: PayloadAction<string>) => {
      const user = state.find((item) => item.id === action.payload);

      if (user) {
        user.active = !user.active;
      }

      return state;
    },
    updateUserActiveToFalse: (state, action: PayloadAction<string>) => {
      const user = state.find((item) => item.id === action.payload);

      if (user) {
        user.active = false;
      }

      return state;
    },
    updateUserActiveToTrue: (state, action: PayloadAction<string>) => {
      const user = state.find((item) => item.id === action.payload);

      if (user) {
        user.active = true;
      }

      return state;
    },
    updataUserRoomId: (
      state,
      action: PayloadAction<{ userId: string; roomId: string }>,
    ) => {
      const user = state.find((item) => item.id === action.payload.userId);

      if (user) {
        user.roomId = action.payload.roomId;
      }

      return state;
    },
    removeUser: (state, action: PayloadAction<string>) =>
      state.filter((client) => client.id !== action.payload),
  },
});

export const selectUserById = (state: RootState, id: string) =>
  state.users.find((user) => user.id === id);

export const selectUserByWS = (state: RootState, ws: WebSocket) =>
  state.users.find((user) => user.ws === ws);

export const selectUsersByIds = (
  state: RootState,
  players: IPlayer[],
  observerIds: string[],
) => {
  const users = [];

  for (const { id } of players) {
    const user = state.users.find((item) => item.id === id);

    if (user) {
      users.push(user);
    }
  }

  for (const id of observerIds) {
    const user = state.users.find((item) => item.id === id);

    if (user) {
      users.push(user);
    }
  }

  return users;
};

export const {
  addUser,
  removeUser,
  toggleUserActive,
  updataUserRoomId,
  updateUserActiveToFalse,
  updateUserActiveToTrue,
} = usersSlice.actions;

export default usersSlice.reducer;
