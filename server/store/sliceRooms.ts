import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IPayloadAddPlayer {
  roomId: string; 
  playerId: string
}

interface IPayloadAddObserver {
  roomId: string; 
  observerId: string
}

type ICellState = 0 | 1 | 2;

type IFieldState = ICellState[];

const initialFieldState: IFieldState = [...Array(9)].map(() => 0);

interface IRoom {
  roomId: string;
  playerIds: string[];
  observerIds: string[];
  currentFieldState: IFieldState;
}

export const createRoom = (roomId: string, playerId: string): IRoom => ({
    roomId,
    playerIds: [playerId],
    observerIds: [],
    currentFieldState: [...initialFieldState],
  });

const initialState: IRoom[] = [];

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IRoom>) => {
      state.push(action.payload);
      return state;
    },

    addPlayerToTheRoom: (state, action: PayloadAction<IPayloadAddPlayer>) => {
      const room = state.find(item => item.roomId === action.payload.roomId);

      room?.playerIds.push(action.payload.playerId);

      return state;
    },

    addObserverToTheRoom: (state, action: PayloadAction<IPayloadAddObserver>) => {
      const room = state.find(item => item.roomId === action.payload.roomId);

      room?.observerIds.push(action.payload.observerId);

      return state;
    },
  },
});

export const selectRoom = (state: RootState, roomId: string): IRoom => state.rooms.find(item => item.roomId === roomId) as IRoom;

export const selectAvailableRoom = (state: RootState): IRoom[] => state.rooms.filter(item => item.playerIds.length === 1);

export const { addRoom, addPlayerToTheRoom, addObserverToTheRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
