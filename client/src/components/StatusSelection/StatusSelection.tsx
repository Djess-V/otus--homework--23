import React, { FC } from "react";
import "./StatusSelection.css";
import Button from "../UI/Button/Button";

interface IProps {
  onClickPlayer: () => void;
  onClickObserver: () => void;
}

const StatusSelection: FC<IProps> = ({ onClickPlayer, onClickObserver }) => (
  <div className="status-selection">
    <h2 className="status-selection__title">Choose your status!</h2>
    <div className="status-selection__buttons">
      <Button title="Player" onClick={onClickPlayer} />
      <Button title="Observer" onClick={onClickObserver} />
    </div>
  </div>
);

export default StatusSelection;
