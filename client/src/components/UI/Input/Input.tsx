import React, { FC, useState } from "react";
import "./Input.css";

interface IProps {
  type?: "text" | "date" | "password" | "time" | "email" | "tel";
  requared?: boolean;
  modify?: string;
  placeholder?: string;
  name?: string;
  outValue?: null | string;
  outOnChange?: null | ((e: React.SyntheticEvent) => void);
}

const Input: FC<IProps> = ({
  type = "text",
  requared = false,
  modify = "",
  placeholder = "",
  name = "",
  outValue = null,
  outOnChange = null,
}) => {
  const [value, setValue] = useState("");

  return (
    <input
      data-testid="input"
      type={type}
      className={`_input ${modify ? `input_${modify}` : modify}`}
      required={requared}
      name={name}
      maxLength={15}
      placeholder={placeholder}
      value={typeof outValue === "string" ? outValue : value}
      onChange={
        typeof outOnChange === "function"
          ? outOnChange
          : (e) => setValue(e.target.value)
      }
    />
  );
};

export default Input;
