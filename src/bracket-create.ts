import { CONFIG } from "./config";
import { Pool } from "./pool";
import readline from "readline";
import { Player, BracketGame } from "./types/pool";
import { Game, Team } from "./types/mml";

const ask = async (rl: readline.Interface, query: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(query, resolve);
  });

const makePick = async (
  rl: readline.Interface,
  game: BracketGame,
  picks: Player["picks"],
  ordIdToTeam: { [ordId: number]: Team }
): Promise<number> => {
  if (game.gameData.contestId in picks) {
    return picks[game.gameData.contestId];
  }
  let teams: Team[] = game.gameData.teams;
  if (teams.length < 2) {
    const pickedTeams: Team[] = [];
    for (const fromGame of game.from) {
      const pickedTeamId = await makePick(rl, fromGame, picks, ordIdToTeam);
      pickedTeams.push(ordIdToTeam[pickedTeamId]);
    }
    teams = [...teams, ...pickedTeams];
  }
  let pick: string = "";
  const team1 = teams[0];
  const team2 = teams[1];
  while (pick !== "1" && pick !== "2") {
    pick = await ask(
      rl,
      `${game.gameData.bracketId} (1)${team1.name6Char} vs. (2)${team2.name6Char}: `
    );
  }
  if (pick === "1") {
    picks[game.gameData.contestId] = team1.ncaaOrgId;
    return team1.ncaaOrgId;
  } else {
    picks[game.gameData.contestId] = team2.ncaaOrgId;
    return team2.ncaaOrgId;
  }
};

const makePlayerPicks = async () => {
  const pool = new Pool(CONFIG);
  await pool.load();
  if (!pool.games) {
    throw Error("Pool failed to load?");
  }
  const rl = readline.createInterface(process.stdin, process.stdout);
  const [_node, _jsfile, playerId, ...roundStrings] = process.argv;
  if (!playerId || playerId === "") {
    console.log("Please provide a player ID in the command line arguments");
  }
  let rounds: number[] | undefined = undefined;
  if (roundStrings && roundStrings.length > 0) {
    rounds = roundStrings.map((roundStrings) => Number(roundStrings));
  }
  const existingPlayer = pool.getPlayerById(playerId);
  let playerPicks: Player["picks"];
  if (existingPlayer) {
    playerPicks = existingPlayer.picks;
  } else {
    playerPicks = {};
  }

  const bracketGames = pool.games.reduce((acc, game) => {
    acc[game.bracketId] = { to: null, from: [], gameData: game };
    return acc;
  }, {} as { [bracketId: string]: BracketGame });
  for (const bracketGame of Object.values(bracketGames)) {
    if (bracketGame.gameData.victorBracketPositionId) {
      const winnerGame =
        bracketGames[bracketGame.gameData.victorBracketPositionId];
      bracketGame.to = winnerGame;
      winnerGame.from.push(bracketGame);
    }
  }
  const pickGames = Object.values(bracketGames).filter(
    (game) => !rounds || rounds.includes(game.gameData.round.roundNumber)
  );
  for (const game of pickGames) {
    await makePick(rl, game, playerPicks, pool.getTeams());
  }
  pool.addOrUpdatePicks(playerId, playerPicks);
  pool.save();
  process.exit(0);
};

makePlayerPicks();
