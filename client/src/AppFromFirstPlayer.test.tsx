import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import server from "../../mocks/fakeServer";
import App from "./App";
import store from "./store/store";
import serverMessagesForPlayer from "./utilForTests/serverMessagesForFirstPlayer";

describe("App", () => {
  const user = userEvent.setup();

  beforeAll(async () => {
    await server.connected;
    server.send(`{ "connectionMessage": "Hello!" }`);
  });

  it("check rendering of a component with an open ws connection", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText("TIC-TAC-TOE")).toBeInTheDocument();

    expect(screen.getByText("Player")).toBeInTheDocument();

    expect(screen.getByText("Observer")).toBeInTheDocument();
  });

  it("testing the application from the first player", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await user.click(screen.getByText("Player"));

    const input = screen.getByTestId("input") as HTMLInputElement;

    await user.type(input, "Djess");

    expect(input.value).toBe("Djess");

    await user.click(screen.getByTestId("btnCreateRoom"));

    server.send(serverMessagesForPlayer.messageCreateRoom);

    expect(
      screen.getByText(
        "Please wait for the second player to connect to your room.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("678aa79f-9b32-4bdd-b3b2-b2ef4bf0b473"),
    ).toBeInTheDocument();

    server.send(serverMessagesForPlayer.messageFirstUserActive);

    server.send(serverMessagesForPlayer.messageStartRoom);

    expect(screen.getByText("Djess")).toBeInTheDocument();
    expect(screen.getByText("Greg")).toBeInTheDocument();

    const squares = screen.queryAllByTestId("square");

    expect(squares.length).toBe(9);

    await user.click(squares[0]);

    server.send(serverMessagesForPlayer.steps[0]);

    let images = screen.queryAllByTestId("image") as HTMLImageElement[];

    expect(images.length).toBe(1);
    expect(images[0].alt).toBe("Cross");

    server.send(serverMessagesForPlayer.steps[1]);

    images = screen.queryAllByTestId("image") as HTMLImageElement[];

    expect(images.length).toBe(2);
    expect(images[1].alt).toBe("Zero");

    await user.click(squares[4]);

    server.send(serverMessagesForPlayer.steps[2]);
    server.send(serverMessagesForPlayer.steps[3]);

    await user.click(squares[8]);

    server.send(serverMessagesForPlayer.steps[4]);

    expect(screen.getByText("Winner - Djess!")).toBeInTheDocument();

    await user.click(screen.getByText("One more time!"));

    server.send(serverMessagesForPlayer.messageGameProposal);

    expect(
      screen.getByText(
        "The participant has initialised the creation of a new game! We are waiting for the confirmation of the second participant!",
      ),
    ).toBeInTheDocument();

    server.send(serverMessagesForPlayer.messageObtainingConsent);

    const newImages = screen.queryAllByTestId("image");

    expect(newImages.length).toBe(0);

    server.send(serverMessagesForPlayer.logoutMessage);

    expect(screen.getByText("Greg left the game!")).toBeInTheDocument();
  });

  it("checking rendering of a component with no ws connection", async () => {
    server.close();
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText("The server went down!")).toBeInTheDocument();
  });
});
