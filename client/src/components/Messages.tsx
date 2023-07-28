import React, { FC } from "react";

interface IProps {
  messages: string[];
}

const Messages: FC<IProps> = ({ messages }) => (
  <div className="messages">
    {messages.map((item, i) => (
      <div key={i}>{item}</div>
    ))}
  </div>
);

export default Messages;
