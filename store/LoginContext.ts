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

export const defaultStore: Login | undefined = {
  token: "5beac9ac-5c0c-447d-98f9-fb3b6066f076",
  user: {
    has_unread_notifications: false,
    id: 1176,
    is_site_admin: false,
    username: "bd64",
  },
};

export default React.createContext({
  login: defaultStore as Login | undefined,
  setLogin: (login: Login) => {},
});
