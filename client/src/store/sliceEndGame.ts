import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IEndGame {
  winner: string;
  mix: number[];
}

const initialState: Partial<IEndGame> = {};

const endGameSlice = createSlice({
  name: "endGame",
  initialState,
  reducers: {
    addWinner: (state, action: PayloadAction<IEndGame>) => action.payload,
  },
});

export const selectEndGame = (state: RootState) => state.endGame;

export const { addWinner } = endGameSlice.actions;

export default endGameSlice.reducer;
