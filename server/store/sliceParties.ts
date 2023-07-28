import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ICellState = 0 | 1 | 2;

type IFieldState = ICellState[];

interface IParty {
  partyId: string;
  currentFieldState: IFieldState;
}

const initialState: IParty[] = [];

const partiesSlice = createSlice({
  name: "parties",
  initialState,
  reducers: {
    addParty: (state, action: PayloadAction<IParty>) => {
      state.push(action.payload);
      return state;
    },
  },
});

export const { addParty } = partiesSlice.actions;

export default partiesSlice.reducer;
