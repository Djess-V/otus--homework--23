import React, { FC } from "react";
import { useSelector } from "react-redux";
import Board from "./Board/Board";
import x from "./Board/Square/images/x.svg";
import o from "./Board/Square/images/o.svg";
import { selectUser } from "../../store/sliceUser";
import { selectRoom } from "../../store/sliceRoom";
import "./Game.css";

interface IProps {
  onClickSquare: (i: number) => void;
}

const Game: FC<IProps> = ({ onClickSquare }) => {
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);

  return (
    <div className="game">
      <p className="game__number-of-observers">
        Number of observers - {room.observerIds ? room.observerIds.length : 0}.
      </p>
      <div className="game__players">
        <p
          className={`game__players_player ${
            room.players &&
            ((user.id === room.players[0].id && user.active) ||
              (user.id !== room.players[0].id &&
                !user.active &&
                user.status === "player") ||
              (user.status === "observer" && room.players[0].active))
              ? "game__players_player_active"
              : ""
          }`}
        >
          {room.players ? room.players[0].name : ""}{" "}
          <img src={x} alt="X" width="30px" height="30px" />
        </p>
        <p
          className={`game__players_player ${
            room.players &&
            ((user.id === room.players[1].id && user.active) ||
              (user.id !== room.players[1].id &&
                !user.active &&
                user.status === "player") ||
              (user.status === "observer" && room.players[1].active))
              ? "game__players_player_active"
              : ""
          }`}
        >
          {room.players ? room.players[1].name : ""}
          <img src={o} alt="O" width="30px" height="30px" />
        </p>
      </div>
      <div className="game__board board-game">
        <Board
          squares={room.field ? room.field : []}
          onClickSquare={onClickSquare}
        />
      </div>
    </div>
  );
};

export default Game;
