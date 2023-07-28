import { configureStore } from "@reduxjs/toolkit";
import partiesReducer from "./sliceParties";
import clientsReducer from "./sliceClients";

const store = configureStore({
  reducer: {
    parties: partiesReducer,
    clients: clientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
