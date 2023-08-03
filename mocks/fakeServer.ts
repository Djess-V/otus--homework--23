import WS from "jest-websocket-mock";
import pkg from "../package.json";

const server = new WS(pkg.proxy);

export default server;
