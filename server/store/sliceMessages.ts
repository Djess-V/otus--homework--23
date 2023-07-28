import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
      return state;
    },
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
