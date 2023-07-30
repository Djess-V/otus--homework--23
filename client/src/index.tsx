import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { WSManager } from "./WSManager/WSManager";
import store from "./store/store";
import pkg from "../../package.json";

export const socketManager = new WSManager(pkg.proxy, store);

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
