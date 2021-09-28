import { lotideRequest } from "./util";

export async function login(
  apiUrl: string,
  username: string,
  password: string,
): Promise<Login> {
  return lotideRequest(
    { apiUrl },
    "POST",
    "logins",
    { username, password },
    true,
  ).then(data => data.json());
}

export async function register(
  apiUrl: string,
  username: string,
  password: string,
  email?: string,
): Promise<Login> {
  return lotideRequest(
    { apiUrl },
    "POST",
    "users",
    {
      username,
      password,
      email_address: email,
      login: true,
    },
    true,
  ).then(data => data.json());
}

export async function logout(ctx: LotideContext) {
  return lotideRequest(ctx, "DELETE", "logins/~current");
}
