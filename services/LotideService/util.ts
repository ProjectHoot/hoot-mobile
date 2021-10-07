export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function hasLogin(ctx: LotideContext): boolean {
  return !!ctx.apiUrl && !!ctx.login;
}

export async function lotideRequest(
  ctx: LotideContext,
  method: RequestMethod,
  path: string,
  body?: any,
  noLogin: boolean = false,
): Promise<any | undefined> {
  if (!ctx.apiUrl) throw "No API url";
  if (!noLogin && !ctx.login?.token) throw "Not logged in";
  return fetch(`${ctx.apiUrl}/${path}`, {
    method,
    headers: buildHeaders(ctx),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
    .then(async res => {
      if (res.ok) {
        return res;
      } else {
        throw await res.text();
      }
    })
    .catch(e => {
      console.error(
        `Lotide Service Error: ${method} ${ctx.apiUrl}/${path}\n${e}`,
        ctx,
      );
      throw e;
    });
}

export function buildHeaders(ctx: LotideContext): HeadersInit | undefined {
  return ctx.login !== undefined
    ? {
        Authorization: `Bearer ${ctx.login.token}`,
        "Content-Type": "application/json",
      }
    : undefined;
}
