import React, { FC, FormEvent } from "react";
import "./FormStart.css";
import Button from "../Button/Button";
import Input from "../Input/Input";

interface IProps {
  onSubmit: (e: FormEvent) => void;
}

const FormStart: FC<IProps> = ({ onSubmit }) => (
  <div className="formStart _container">
    <form onSubmit={onSubmit} className="formStart__form">
      <Input
        requared={true}
        placeholder="Enter your name..."
        name="name"
        modify="formStart"
      />
      <Button title="Start Game" type="submit" />
    </form>
  </div>
);

export default FormStart;
