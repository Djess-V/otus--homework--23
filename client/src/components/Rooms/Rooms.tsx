import React, { FC } from "react";
import "./Rooms.css";

interface IProps {
  status: "player" | "observer" | undefined;
  rooms: string[];
  onClickRoom: (id: string) => void;
}

const Rooms: FC<IProps> = ({ status, rooms, onClickRoom }) => (
  <div className="rooms _container">
    <h3 className="rooms__title">{`${
      status === "player" ? "Available" : "All"
    } rooms:`}</h3>
    <ol className="rooms__list">
      {rooms.map((id) => (
        <li
          className="rooms__list_item"
          key={id}
          onClick={() => onClickRoom(id)}
        >
          {id}
        </li>
      ))}
    </ol>
    {!rooms.length && <p className="rooms__message">No rooms!</p>}
  </div>
);

export default Rooms;
