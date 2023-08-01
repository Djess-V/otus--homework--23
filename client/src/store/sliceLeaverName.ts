import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: string = "";

const leaverNameSlice = createSlice({
  name: "leaverName",
  initialState,
  reducers: {
    addLeaverName: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const selectLeaverName = (state: RootState) => state.leaverName;

export const { addLeaverName } = leaverNameSlice.actions;

export default leaverNameSlice.reducer;
