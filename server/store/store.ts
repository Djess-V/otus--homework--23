import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "./sliceRooms";
import clientsReducer from "./sliceClients";

const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    clients: clientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
