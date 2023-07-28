import React, { FC } from "react";
import "./Parties.css";

type ICellState = 0 | 1 | 2;

type IFieldState = ICellState[];

interface IParty {
  partyId: string;
  currentFieldState: IFieldState;
}

interface IProps {
  parties: IParty[];
  onClickParty: (id: string) => void;
}

const Parties: FC<IProps> = ({ parties, onClickParty }) => (
  <div className="parties _container">
    <ol>
      {parties.map((party) => (
        <li key={party.partyId} onClick={() => onClickParty(party.partyId)}>
          {party.partyId}
        </li>
      ))}
    </ol>
  </div>
);

export default Parties;
