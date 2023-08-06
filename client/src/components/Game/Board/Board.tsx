import React, { FC } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import Square from "../Square/Square";
import { selectEndGame } from "../../../store/sliceEndGame";
import "./Board.css";

interface IProps {
  squares: number[];
  onClickSquare: (i: number) => void;
}

const Board: FC<IProps> = ({ squares, onClickSquare }) => {
  const endGame = useSelector(selectEndGame);

  const rows = [...Array(3)].map((_, i) => (
    <div key={i} className="board-game__row board-row">
      {[...Array(3)].map((__, j) => {
        const index = 3 * i + j;

        let winner = false;

        if (endGame.mix) {
          winner = endGame.mix.includes(index);
        }

        return (
          <Square
            key={v4()}
            index={index}
            value={squares[index]}
            onClick={onClickSquare}
            winner={winner}
          />
        );
      })}
    </div>
  ));

  return <>{rows}</>;
};

export default Board;
