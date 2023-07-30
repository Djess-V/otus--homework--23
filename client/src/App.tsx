import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux/es/exports";
import Title from "./components/Title/Title";
import StatusSelection from "./components/StatusSelection/StatusSelection";
import "./App.css";
import Rooms from "./components/Rooms/Rooms";
import RoomSelectionMenu from "./components/RoomSelectionMenu/RoomSelectionMenu";
import Input from "./components/UI/Input/Input";
import Message from "./components/Message/Message";
import Game from "./components/Game/Game";
import { selectConnection } from "./store/sliceConnection";
import { selectRoom } from "./store/sliceRoom";
import { selectRooms } from "./store/sliceRooms";
import { socketManager } from ".";

interface IState {
  start: boolean;
  showStatusSelection: boolean;
  showRoomSelection: boolean;
  showRooms: boolean;
  showInput: boolean;
  showMessage: boolean;
}

const initState: IState = {
  start: false,
  showStatusSelection: true,
  showRoomSelection: false,
  showRooms: false,
  showInput: false,
  showMessage: false,
};

const App: FC = () => {
  const [state, setState] = useState<IState>(initState);
  const [status, setStatus] = useState<"player" | "observer" | undefined>(
    undefined,
  );
  const [name, setName] = useState<string>("");

  const connection = useSelector(selectConnection);
  const room = useSelector(selectRoom);
  const rooms = useSelector(selectRooms);

  const handleClickPlayer = () => {
    if (!connection) {
      return;
    }

    setState({
      ...state,
      showInput: true,
      showStatusSelection: false,
      showRooms: false,
    });
    setStatus("player");
  };

  const handleClickObserver = () => {
    if (!connection) {
      return;
    }

    if (!state.showRooms) {
      setState({ ...state, showRooms: true });
      setStatus("observer");
      socketManager.send({ getAllRooms: true });
    }
  };

  const handleChangeInput = (e: React.SyntheticEvent) => {
    if (!(e.target as HTMLInputElement).value) {
      setState({ ...state, showRooms: false, showRoomSelection: false });
    } else {
      setState({ ...state, showRoomSelection: true });
    }

    setName((e.target as HTMLInputElement).value);
  };

  const handleClickCreateRoom = () => {
    setState({
      ...state,
      showRoomSelection: false,
      showInput: false,
      showRooms: false,
    });
    socketManager.send({ status, name, createRoom: true });
  };

  const handleClickChooseRoom = () => {
    if (!state.showRooms) {
      setState({ ...state, showInput: false, showRooms: true });
      socketManager.send({ getAllRooms: false });
    }
  };

  const handleClickRoom = (id: string) => {
    if (!connection) {
      return;
    }

    setState({ ...state, showRooms: false, showStatusSelection: false });
    socketManager.send({ status, name, roomId: id });
  };

  useEffect(() => {
    if ("playerIds" in room) {
      if ((room.playerIds as unknown as string[]).length === 1) {
        setState({ ...state, showMessage: true, showStatusSelection: false });
      } else if ((room.playerIds as unknown as string[]).length === 2) {
        setState({
          ...state,
          start: true,
          showStatusSelection: false,
          showMessage: false,
          showRoomSelection: false,
        });
      }
    }
  }, [room]);

  return (
    <div className="_container">
      <Title />
      {state.showStatusSelection && (
        <StatusSelection
          onClickPlayer={handleClickPlayer}
          onClickObserver={handleClickObserver}
        />
      )}
      {state.showInput && (
        <Input
          requared={true}
          placeholder="Enter your name..."
          name="name"
          modify="name"
          outValue={name}
          outOnChange={handleChangeInput}
        />
      )}
      {state.showRoomSelection && (
        <RoomSelectionMenu
          onClickCreateRoom={handleClickCreateRoom}
          onClickChooseRoom={handleClickChooseRoom}
        />
      )}
      {state.showRooms && (
        <Rooms status={status} rooms={rooms} onClickRoom={handleClickRoom} />
      )}
      {state.showMessage && (
        <Message
          status={status}
          roomId={"roomId" in room ? (room.roomId as unknown as string) : ""}
        />
      )}
      {state.start && <Game />}
    </div>
  );
};

export default App;
