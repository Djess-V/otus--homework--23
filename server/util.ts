import { IUser } from "./store/sliceUsers";

export const transformUserToSend = (user: IUser) => ({
  id: user.id,
  name: user.name,
  status: user.status,
  active: user.active,
});
