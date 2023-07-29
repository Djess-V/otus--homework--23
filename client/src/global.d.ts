declare const PREFIX: string;
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
declare module "*.css";


declare type ICellState = 0 | 1 | 2;

declare type IFieldState = ICellState[];

declare interface IRoom {
    roomId: string;
    playerIds: string[];
    observerIds: string[];
    currentFieldState: IFieldState;
  }

declare interface IWsData {
    rooms?: IRoom[],
    room?: IRoom,
    start?: boolean,
}