import React, { FC } from "react";
import "./Message.css";

interface IProps {
  status: "player" | "observer" | undefined;
  roomId: string;
}

const Message: FC<IProps> = ({ status, roomId }) => {
  const messageForObserver = (
    <>
      <p className="message">
        Please wait for the second player to connect to your room.
      </p>
    </>
  );

  const messageForPlayer = (
    <>
      <p className="message">
        Please wait for the second player to connect to your room.
      </p>
      <p className="message">
        Your room ID is <span>{roomId}</span>.
      </p>
      <p className="message">
        Send the ID to the second player or wait for a random opponent!
      </p>
    </>
  );
  return <>{status === "player" ? messageForPlayer : messageForObserver}</>;
};

export default Message;
