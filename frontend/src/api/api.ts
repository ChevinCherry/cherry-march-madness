import {
  APIPoolData,
  APICreateUserBody,
  APIUser,
  APILoginBody,
} from "./api-types";

const apiRoot = "http://0.0.0.0:3000";

export const pingAPI = async () => {
  return (await fetch(`${apiRoot}/`, { method: "GET" })).json();
};

export const createUser = async (params: APICreateUserBody) => {
  const user = await (
    await fetch(`${apiRoot}/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
  ).json();
  return user as APIUser;
};

export const login = async (params: APILoginBody) => {
  const user = await (
    await fetch(`${apiRoot}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
  ).json();
  return user as APIUser;
};

export const getActivePool = async () => {
  const poolData = await (
    await fetch(`${apiRoot}/activePool`, { method: "GET" })
  ).json();
  return poolData as APIPoolData;
};

export const getPool = async (poolId: string) => {
  const poolData = await (
    await fetch(`${apiRoot}/pool/${poolId}`, { method: "GET" })
  ).json();
  return poolData as APIPoolData;
};

export const getBracketUpdate = async (bracketSourceId: string) => {
  return (
    await fetch(`${apiRoot}/bracket/${bracketSourceId}`, { method: "POST" })
  ).json();
};

export const makePick = async (
  userId: string,
  poolId: string,
  mmlContestId: number,
  mmlTeamId: number
) => {
  return (
    await fetch(`${apiRoot}/makePick`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, poolId, mmlContestId, mmlTeamId }),
    })
  ).json();
};
