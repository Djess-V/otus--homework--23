import React, { FC } from "react";
import "./RoomSelectionMenu.css";
import Button from "../UI/Button/Button";

interface IProps {
  onClickCreateRoom: () => void;
  onClickChooseRoom: () => void;
}

const RoomSelectionMenu: FC<IProps> = ({ onClickCreateRoom, onClickChooseRoom }) => (
  <div className="room-menu">
    <div className="room-menu__buttons">
      <Button title="Create room" onClick={onClickCreateRoom} />
      <Button title="Choose room" onClick={onClickChooseRoom} />
    </div>
  </div>
);

export default RoomSelectionMenu;
