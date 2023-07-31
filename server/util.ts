import { IField } from "./store/sliceRooms";
import { IUser } from "./store/sliceUsers";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const transformUserToSend = (user: IUser) => ({
  id: user.id,
  name: user.name,
  status: user.status,
  active: user.active,
});

export const calculateWinner = (squares: IField) => {
  let mix: number[] = [];

  const len = lines.length;

  for (let i = 0; i < len; i += 1) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      mix = lines[i];
      break;
    }
  }

  if (mix.length) {
    return mix;
  }

  return false;
};
