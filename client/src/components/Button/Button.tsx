import React, { FC } from "react";
import "./Button.css";

interface IProps {
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  modify?: string;
}

const Button: FC<IProps> = ({
  title,
  type = "button",
  onClick = () => {},
  modify = "",
}) => (
  <button
    className={`_button ${modify ? `btn-${modify}` : modify}`}
    type={type}
    onClick={onClick}
  >
    {title}
  </button>
);

export default Button;
