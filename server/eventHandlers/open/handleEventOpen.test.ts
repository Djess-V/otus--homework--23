import "@testing-library/jest-dom";
import WebSocket from "ws";
// eslint-disable-next-line import/no-relative-packages
import client from "../../../mocks/fakeClient";
import { handleEventOpen } from "./handleEventOpen";

jest.mock('../../../mocks/fakeClient', () => ({ send: jest.fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => { throw new Error("Error!")}) 
}));

const sendSpyOn = jest.spyOn(client, "send");

describe("handleEventOpen", () => {
  it("function worked correctly", () => {
    handleEventOpen(client as unknown as WebSocket);

    expect(sendSpyOn).toHaveBeenCalledTimes(1);
  });

  it("the function threw an error", () => { 
    const logSpyOn = jest.spyOn(window.console, "log");

    handleEventOpen(client as unknown as WebSocket);

    expect(logSpyOn).toHaveBeenCalledWith("Error!");
  });
});
