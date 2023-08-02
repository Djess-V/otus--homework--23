import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import server from "../../mocks/fakeServer";
import App from "./App";
import store from "./store/store";
import serverMessagesForObserver from "./utilForTests/serverMessagesForObserver";

describe("App", () => {
  const user = userEvent.setup();

  beforeAll(async () => {
    await server.connected;
    server.send(`{ "connectionMessage": "Hello!" }`);
  });

  it("testing the application from the observer", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await user.click(screen.getByText("Observer"));

    server.send(serverMessagesForObserver.roomAssignmentMessage);

    const rooms = screen.queryAllByTestId("room");

    expect(rooms.length).toBe(1);

    await user.click(rooms[0]);

    server.send(serverMessagesForObserver.userReceiptMessage);

    expect(
      screen.getByText(
        "Please wait for the second player to connect to your room.",
      ),
    ).toBeInTheDocument();

    server.send(serverMessagesForObserver.gameStartMessage);

    const squares = screen.queryAllByTestId("square");

    expect(squares.length).toBe(9);

    await user.click(squares[0]);

    const images = screen.queryAllByTestId("image");

    expect(images.length).toBe(0);
  });
});
