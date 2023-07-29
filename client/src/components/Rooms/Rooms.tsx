import React, { FC } from "react";
import "./Rooms.css";

type ICellState = 0 | 1 | 2;

type IFieldState = ICellState[];

interface IRoom {
  roomId: string;
  currentFieldState: IFieldState;
}

interface IProps {
  status: "player" | "observer" | "";
  rooms: IRoom[];
  onClickRoom: (id: string) => void;
}

const Rooms: FC<IProps> = ({ status, rooms, onClickRoom }) => (
  <div className="rooms _container">
    <h3 className="rooms__title">{`${status === "player" ? "Available" : "All"} rooms:`}</h3>
    <ol className="rooms__list">
      {rooms.map((room) => (
        <li className="rooms__list_item" key={room.roomId} onClick={() => onClickRoom(room.roomId)}>
          {room.roomId}
        </li>
      ))}
    </ol>
    {!rooms.length && <p className="rooms__message">No rooms!</p>}
  </div>
);

export default Rooms;
