import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectEndGame } from "../../store/sliceEndGame";
import "./ModalEndGame.css";
import { selectRoom } from "../../store/sliceRoom";
import Button from "../UI/Button/Button";
import { selectUser } from "../../store/sliceUser";

interface IProps {
  newGame: boolean;
  onClickNewGame: () => void;
  onClickOffer: () => void;
  offer: boolean;
}

const ModalEndGame: FC<IProps> = ({
  newGame,
  onClickNewGame,
  onClickOffer,
  offer,
}) => {
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);
  const endGame = useSelector(selectEndGame);

  const getNameWinner = () => {
    if (!room.players) {
      return "";
    }

    const player = room.players.find((item) => item.active);

    if (!player) {
      return "";
    }

    return player.name;
  };

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
              {!endGame.winner
                ? "Tie!"
                : getNameWinner()
                ? `Winner - ${getNameWinner()}!`
                : "Waiting"}
            </div>
            {user.status !== "observer" && (
              <>
                {!newGame && (
                  <>
                    {offer && (
                      <div className="modal-content__body">
                        <Button
                          title="You've been asked to play. Let's play!"
                          onClick={onClickOffer}
                        />
                      </div>
                    )}
                    {!offer && (
                      <div className="modal-content__body">
                        <Button
                          title="One more time!"
                          onClick={onClickNewGame}
                        />
                      </div>
                    )}
                    <div className="modal-content__footer">
                      <span className="modal-content__footer_note">Note: </span>
                      In a new game, the player who was second in the current
                      game has the right of first move
                    </div>
                  </>
                )}
                {newGame && (
                  <div className="modal-content__body">
                    The participant has initialised the creation of a new game!
                    We are waiting for the confirmation of the second
                    participant!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEndGame;
