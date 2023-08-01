import React, { FC } from "react";
import "./ModalPlayerHasLeftGame.css";

interface IProps {
  leaverName: string;
}

const ModalPlayerHasLeftGame: FC<IProps> = ({ leaverName }) => (
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
            {leaverName} left the game!
          </div>
          <div className="modal-content__body">
            Page reloading is required for further work with the application!
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ModalPlayerHasLeftGame;
