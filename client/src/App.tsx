import React, { FC, useEffect, useState } from "react";
import Title from "./components/Title/Title";
import Menu from "./components/Menu/Menu";
import FormStart from "./components/FormStart/FormStart";
import Parties from "./components/Parties/Parties";
import "./App.css";

const url = `ws://localhost:3001`;
export const socket = new WebSocket(url);

const App: FC = () => {
  const [parties, setParties] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(true);
  const [showFormStart, setShowFormStart] = useState(false);

  const handleClickPlayer = () => {
    if (!connectionOpen) {
      return;
    }

    setShowFormStart(true);
  };

  const handleClickObserver = () => {
    if (!connectionOpen) {
      return;
    }

    socket.send("getParties");
  };

  const handleSubmitFormStart = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!connectionOpen) {
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    socket.send(JSON.stringify({ status: "player", name: target.name.value }));
  };

  const handleClickParty = (id: string) => {
    if (!connectionOpen) {
      return;
    }

    socket.send(JSON.stringify({ status: "observer", partyId: id }));

    setParties([]);
  };

  const handleSocketEventMessage = (event: MessageEvent) => {
    console.log(event.data);

    const data = JSON.parse(event.data);

    if ("parties" in data) {
      setParties(data.parties);
    }
  };

  const handleSocketEventClose = (event: CloseEvent) => {
    console.log(`Closed ${event.code}`);
    setConnectionOpen(false);
  };

  useEffect(() => {
    socket.addEventListener("message", handleSocketEventMessage);

    socket.addEventListener("close", handleSocketEventClose);

    return () => {
      socket.removeEventListener("message", handleSocketEventMessage);

      socket.removeEventListener("close", handleSocketEventClose);
    };
  }, []);

  return (
    <>
      <Title />
      <Menu
        onClickPlayer={handleClickPlayer}
        onClickObserver={handleClickObserver}
      />
      {showFormStart && <FormStart onSubmit={handleSubmitFormStart} />}
      <Parties parties={parties} onClickParty={handleClickParty} />
    </>
  );
};

export default App;
