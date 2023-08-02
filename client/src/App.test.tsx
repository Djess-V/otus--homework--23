import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import store from "./store/store";
import { closeConnection, openConnection } from "./store/sliceConnection";

describe("App", () => {
  it("check rendering of a component with an open ws connection", async () => {
    store.dispatch(openConnection("Hello!"));

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText("TIC-TAC-TOE")).toBeInTheDocument();

    expect(screen.getByText("Player")).toBeInTheDocument();

    expect(screen.getByText("Observer")).toBeInTheDocument();
  });

  it("checking rendering of a component with no ws connection", async () => {
    store.dispatch(closeConnection());
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText("The server went down!")).toBeInTheDocument();
  });
});
