import React, { FC } from "react";
import "./Square.css";
import x from "./images/x.svg";
import o from "./images/o.svg";

interface IProps {
  index: number;
  value: number;
  onClick: (i: number) => void;
}

const Square: FC<IProps> = ({ index, value, onClick }) => (
  <button className="board-row__square" onClick={() => onClick(index)}>
    {value !== 0 && (
      <img src={value === 1 ? x : o} alt="Square" width="80%" height="80%" />
    )}
  </button>
);

export default Square;
