import React, { FC } from "react";
import "./Menu.css";
import Button from "../Button/Button";

interface IProps {
  onClickPlayer: () => void;
  onClickObserver: () => void;
}

const Menu: FC<IProps> = ({ onClickPlayer, onClickObserver }) => (
  <div className="menu _container">
    <h2 className="menu__title">Choose your status!</h2>
    <div className="menu__buttons">
      <Button title="Player" onClick={onClickPlayer} />
      <Button title="Observer" onClick={onClickObserver} />
    </div>
  </div>
);

export default Menu;
