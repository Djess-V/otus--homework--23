import React, { FC } from "react";
import "./Button.css";

interface IProps {
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  modify?: string;
  disabled?: boolean;
}

const Button: FC<IProps> = ({
  title,
  type = "button",
  onClick = () => {},
  modify = "",
  disabled = false,
}) => (
  <button
    className={`_button ${modify ? `btn_${modify}` : modify}`}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {title}
  </button>
);

export default Button;
