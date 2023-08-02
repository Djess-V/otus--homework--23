import WSManager from "./WSManager";
import pkg from "../../../package.json";
import store from "../store/store";

export const socketManager = new WSManager(pkg.proxy, store);
