import React, { FC } from "react";
import { v4 } from "uuid";
import Square from "./Square/Square";
import "./Board.css";

interface IProps {
  squares: number[];
  onClickSquare: (i: number) => void;
}

const Board: FC<IProps> = ({ squares, onClickSquare }) => {
  const rows = [...Array(3)].map((_, i) => (
    <div key={i} className="board-game__row board-row">
      {[...Array(3)].map((__, j) => (
        <Square
          key={v4()}
          index={3 * i + j}
          value={squares[3 * i + j]}
          onClick={onClickSquare}
        />
      ))}
    </div>
  ));

  return <>{rows}</>;
};

export default Board;
