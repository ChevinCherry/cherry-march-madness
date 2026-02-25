import {
  APIPoolData,
  APICreateUserBody,
  APIUser,
  APILoginBody,
  APIBracketSource,
} from "./api-types";

export class AuthExpiredError extends Error {}

export class API {
  private static root = "http://localhost:3000";

  public static onAuthExpired = async () => {};

  static async authedFetch(
    ...args: Parameters<typeof fetch>
  ): ReturnType<typeof fetch> {
    let response = await fetch(...args);
    if (response.status === 401) {
      const refreshResponse = await fetch(`${API.root}/refreshAccessToken`, {
        method: "POST",
      });
      if (refreshResponse.status === 401) {
        await API.onAuthExpired();
        throw new AuthExpiredError();
      }
      response = await fetch(...args);
    }
    return response;
  }

  // NO AUTH REQUIRED FUNCTIONS
  static async ping() {
    return (await fetch(`${API.root}/`, { method: "GET" })).text();
  }

  static async createUser(params: APICreateUserBody) {
    const user = await (
      await fetch(`${API.root}/createUser`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
    ).json();
    return user as APIUser;
  }

  static async login(params: APILoginBody) {
    const user = await (
      await fetch(`${API.root}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
    ).json();
    return user as APIUser;
  }

  static async refreshAccessToken() {
    await fetch(`${API.root}/refreshAccessToken`, {
      method: "POST",
      credentials: "include",
    });
  }

  // AUTH REQUIRED FUNCTIONS

  static async checkAuth() {
    const res = await await API.authedFetch(`${API.root}/checkAuth`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      return (await res.json()) as APIUser;
    } else {
      return null;
    }
  }

  static async getActivePool() {
    const poolData = await (
      await API.authedFetch(`${API.root}/activePool`, {
        method: "GET",
        credentials: "include",
      })
    ).json();
    return poolData as APIPoolData;
  }

  static async getPool(poolId: string) {
    const poolData = await (
      await API.authedFetch(`${API.root}/pool/${poolId}`, {
        method: "GET",
        credentials: "include",
      })
    ).json();
    return poolData as APIPoolData;
  }

  static async getBracketUpdate(bracketSourceId: string) {
    const bracketData = await (
      await API.authedFetch(`${API.root}/bracket/${bracketSourceId}`, {
        method: "POST",
        credentials: "include",
      })
    ).json();
    return bracketData as APIBracketSource;
  }

  static async makePick(
    userId: string,
    poolId: string,
    mmlContestId: number,
    mmlTeamId: number
  ) {
    return (
      await API.authedFetch(`${API.root}/makePick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, poolId, mmlContestId, mmlTeamId }),
      })
    ).json();
  }
}
