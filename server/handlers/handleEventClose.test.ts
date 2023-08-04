import "@testing-library/jest-dom";
import WebSocket from "ws";
// eslint-disable-next-line import/no-relative-packages
import { client } from "../../mocks/fakeClient";
import { handleEventClose } from "./handleEventClose";

describe("handleEventClose", () => {
  it("If there is no data in store, an error will be thrown", () => {
    const logSpyOn = jest.spyOn(window.console, "log");

    handleEventClose(client as unknown as WebSocket);

    expect(logSpyOn).toHaveBeenCalledWith(
      "When closing WS connection on user's initiative - user not found!",
    );
  });
});
