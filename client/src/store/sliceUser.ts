import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IUser {
  id: string;
  name: string;
  status: "player" | "observer";
  active: boolean;
}

const initialState: Partial<IUser> = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => action.payload,
    removeUser: () => {},
  },
});

export const selectUser = (state: RootState) => state.user;

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
