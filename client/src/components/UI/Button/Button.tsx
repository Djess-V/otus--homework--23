import React, { FC } from "react";
import "./Button.css";

interface IProps {
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  modify?: string;
  disabled?: boolean;
  testId?: string;
}

const Button: FC<IProps> = ({
  title,
  type = "button",
  onClick = () => {},
  modify = "",
  disabled = false,
  testId = "button",
}) => (
  <button
    data-testid={testId}
    className={`_button ${modify ? `btn_${modify}` : modify}`}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {title}
  </button>
);

export default Button;
