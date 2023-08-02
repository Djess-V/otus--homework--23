import React, { FC } from "react";
import x from "./images/x.svg";
import o from "./images/o.svg";
import "./Square.css";

interface IProps {
  index: number;
  value: number;
  onClick: (i: number) => void;
  winner: boolean;
}

const Square: FC<IProps> = ({ index, value, onClick, winner }) => (
  <button
    className={`board-row__square ${
      winner ? "board-row__square_status_winner" : ""
    }`}
    onClick={() => onClick(index)}
  >
    {value !== 0 && (
      <img src={value === 1 ? x : o} alt="Square" width="80%" height="80%" />
    )}
  </button>
);

export default Square;
