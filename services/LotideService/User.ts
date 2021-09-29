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

export async function forgotPasswordRequestKey(
  ctx: LotideContext,
  email: string,
) {
  return lotideRequest(
    ctx,
    "POST",
    "forgot_password/keys",
    {
      email_address: email,
    },
    true,
  );
}

export async function forgotPasswordTestKey(ctx: LotideContext, key: string) {
  return lotideRequest(
    ctx,
    "GET",
    `forgot_password/keys/${key}`,
    undefined,
    true,
  );
}

export async function forgotPasswordReset(
  ctx: LotideContext,
  key: string,
  newPassword: string,
) {
  return lotideRequest(
    ctx,
    "POST",
    `forgot_password/keys/${key}/reset`,
    { new_password: newPassword },
    true,
  );
}
