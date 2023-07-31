import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectEndGame } from "../../store/sliceEndGame";
import "./ModalEndGame.css";
import { IPlayer, selectRoom } from "../../store/sliceRoom";
import Button from "../UI/Button/Button";
import { selectUser } from "../../store/sliceUser";

const ModalEndGame: FC = () => {
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);
  const endGame = useSelector(selectEndGame);

  const nameWinner = (
    (room.players as IPlayer[]).find((item) => item.active) as IPlayer
  ).name;

  return (
    <>
      <div className="modal-backdrop"></div>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        style={{ display: "block" }}
      >
        <div className="modal__dialog modal-dialog">
          <div className="modal-dialog__content modal-content">
            <div className="modal-content__header">
              {endGame.winner ? `Winner - ${nameWinner}!` : "Tie!"}
            </div>
            {user.status !== "observer" && (
              <>
                <div className="modal-content__body">
                  <Button title="One more time!" />
                </div>

                <div className="modal-content__footer">
                  <span className="modal-content__footer_note">Note: </span>
                  In the new game, the losing side has the right of first turn!
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEndGame;
