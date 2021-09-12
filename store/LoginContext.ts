import React from "react";

export interface Login {
  token: string;
  user: User;
}

export interface User {
  has_unread_notifications: boolean;
  id: number;
  is_site_admin: false;
  username: string;
}

export const defaultStore = undefined;

export default React.createContext({
  login: defaultStore as Login | undefined,
  setLogin: (login: Login) => {},
});
