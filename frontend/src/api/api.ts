import { PoolData } from "./api-types";

const apiRoot = "http://0.0.0.0:3000";

export const pingAPI = async () => {
  return (await fetch(`${apiRoot}/`, { method: "GET" })).json();
};

export const getActivePool = async () => {
  return (await fetch(`${apiRoot}/activePool`, { method: "GET" })).json();
};

export const getPool = async (poolId: string) => {
  const json = await (
    await fetch(`${apiRoot}/pool/${poolId}`, { method: "GET" })
  ).json();
  return json as PoolData;
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
