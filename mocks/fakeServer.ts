import WS from "jest-websocket-mock";

const server = new WS("ws://localhost:3001");

export default server;
