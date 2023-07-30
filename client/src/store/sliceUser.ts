import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  id: string;
  name: string;
  status: "player" | "observer";
  active: boolean;
}

const initialState: IUser | NonNullable<unknown> = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => action.payload,
    removeUser: () => {},
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
