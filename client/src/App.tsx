import React, { FC, useEffect, useState } from "react";
import Title from "./components/Title/Title";
import StatusSelection from "./components/StatusSelection/StatusSelection";
import "./App.css";
import Rooms from "./components/Rooms/Rooms";
import RoomSelectionMenu from "./components/RoomSelectionMenu/RoomSelectionMenu";
import Input from "./components/UI/Input/Input";
import Message from "./components/Message/Message";
import Game from "./components/Game/Game";

const url = `ws://localhost:3001`;
export const socket = new WebSocket(url);

const App: FC = () => {
  const [status, setStatus] = useState<"player" | "observer" | "">("");
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<IRoom | null>(null);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [showStatusSelection, setShowStatusSelection] = useState(true);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [connectionOpen, setConnectionOpen] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [start, setStart] = useState(false);

  const handleClickPlayer = () => {
    if (!connectionOpen) {
      return;
    }
    
    setShowStatusSelection(false);
    setShowInput(true);
    setStatus("player");
  };

  const handleClickObserver = () => {
    if (!connectionOpen) {
      return;
    }

    setShowStatusSelection(false);
    setShowRooms(true);
    setStatus("observer");
    socket.send(JSON.stringify({ getAllRooms: true }));
  };

  const handleChangeInput = (e: React.SyntheticEvent) => {
    if (!(e.target as HTMLInputElement).value) {
      setShowRoomSelection(false);
      setShowRooms(false);
    } else {
      setShowRoomSelection(true);
    }
        
    setName((e.target as HTMLInputElement).value);
  };
    
  const handleClickCreateRoom = () => {
    socket.send(JSON.stringify({ status, name, createRoom: true }));
    setShowInput(false);
    setShowRoomSelection(false);
    setShowRooms(false);
  };

  const handleClickChooseRoom = () => {
    socket.send(JSON.stringify({ getAllRooms: false }));
    setShowInput(false);
    setShowRooms(true);
  };

  const handleClickRoom = (id: string) => {
    if (!connectionOpen) {
      return;
    }

    socket.send(JSON.stringify({ status, name, roomId: id }));
  };

  const handleSocketEventMessage = (event: MessageEvent) => {
    const data: IWsData = JSON.parse(event.data);

    console.dir(data);
    if (data.rooms) {
      setRooms(data.rooms);
    }

    if (data.room) {
      setRoom(data.room);
      setShowRooms(false);

      if (data.room.playerIds.length === 1) {
        setShowMessage(true);
      }
      
      if (data.room.playerIds.length === 2 && status === "observer") {
        setStart(true);
      } 
    }

    if (data.start) {      
        setStart(true);
        setShowMessage(false); 
        setShowRoomSelection(false);       
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
    <div className="_container">
      <Title />
      {showStatusSelection && <StatusSelection
        onClickPlayer={handleClickPlayer}
        onClickObserver={handleClickObserver}
      />}
      {showInput && <Input
        requared={true}
        placeholder="Enter your name..."
        name="name"
        modify="name"
        outValue={name}
        outOnChange={handleChangeInput}
      />}
      {showRoomSelection && <RoomSelectionMenu onClickCreateRoom={handleClickCreateRoom} onClickChooseRoom={handleClickChooseRoom}/>}
      {showRooms && <Rooms status={status} rooms={rooms} onClickRoom={handleClickRoom} />}
      {showMessage && <Message status={status} roomId={room ? room.roomId : ""}/>}
      {start && <Game/>}
    </div>
  );
};

export default App;
