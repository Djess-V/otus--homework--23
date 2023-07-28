import React, { FC } from "react";
import "./Input.css";

interface IProps {
  type?: "text" | "date" | "password" | "time" | "email" | "tel";
  requared?: boolean;
  modify?: string;
  placeholder?: string;
  value?: string;
  name?: string;
}

const Input: FC<IProps> = ({
  type = "text",
  requared = false,
  modify = "",
  placeholder = "",
  value = "",
  name = "",
}) => (
  <input
    type={type}
    className={`_input ${modify ? `input_${modify}` : modify}`}
    required={requared}
    name={name}
    placeholder={placeholder}
    value={value}
  />
);

export default Input;
