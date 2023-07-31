import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./sliceConnection";
import userReducer from "./sliceUser";
import roomsReducer from "./sliceRooms";
import roomReducer from "./sliceRoom";
import endGameReducer from "./sliceEndGame";

const store = configureStore({
  reducer: {
    connection: connectionReducer,
    user: userReducer,
    rooms: roomsReducer,
    room: roomReducer,
    endGame: endGameReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
