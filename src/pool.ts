import { Game, Team } from "./types/mml";
import {
  Player,
  GameOfConsequenceData,
  PoolConfig,
  SearchPeriod,
  Standing,
} from "./types/pool";
import fs from "fs";
import path from "path";
import MMLAPI from "./mml-api";

export class Pool {
  private poolConfig: PoolConfig;
  public games: Game[] = [];
  private contestMap: { [contestId: number]: Game };
  private players: Player[];

  constructor(poolConfig: PoolConfig) {
    this.poolConfig = poolConfig;
    this.games = [];
    this.contestMap = {};
    this.players = [];
  }

  private loadPlayer(file: string) {
    if (!this.games) {
      throw Error("Please load MML data before loading brackets");
    }
    const lines = fs.readFileSync(file).toString("utf-8").split("\n");
    const playerId = lines.shift();
    if (!playerId) {
      throw Error(`Player ID missing in bracket ${file}`);
    }
    const picks: Player["picks"] = {};
    for (const line of lines) {
      const [contestId, winnerOrgId] = line.split(",");
      picks[Number(contestId)] = Number(winnerOrgId);
    }
    const player: Player = { id: playerId, picks };
    this.players.push(player);
    return player;
  }

  public async load() {
    this.games = await MMLAPI.getGames();
    for (const game of this.games) {
      this.contestMap[game.contestId] = game;
    }
    const bracketsPath = path.resolve(__dirname, this.poolConfig.bracketsPath);
    for (const file of fs.readdirSync(bracketsPath)) {
      this.loadPlayer(path.resolve(bracketsPath, file));
    }
  }

  public save() {
    if (!this.games) {
      throw Error("Cannot save() before load()");
    }
    const bracketsPath = path.resolve(__dirname, this.poolConfig.bracketsPath);
    for (const player of this.players) {
      const filePath = path.resolve(bracketsPath, player.id + ".csv");
      fs.writeFileSync(
        filePath,
        player.id +
          "\n" +
          Object.entries(player.picks)
            .map((pickPair) => pickPair.join(","))
            .join("\n")
      );
    }
  }

  private getGameResults(game: Game): {
    contestId: number;
    round: number;
    winnerId: number;
    upset: boolean;
  } {
    if (game.teams.length === 0) {
      return {
        contestId: game.contestId,
        round: game.round.roundNumber,
        winnerId: -1,
        upset: false,
      };
    }
    let favoriteSeed = Number.MAX_SAFE_INTEGER;
    let winner = game.teams[0];
    for (const team of game.teams) {
      if (team.seed < favoriteSeed) {
        favoriteSeed = team.seed;
      }
      if (team.score > winner.score) {
        winner = team;
      }
    }
    return {
      contestId: game.contestId,
      round: game.round.roundNumber,
      winnerId: winner.ncaaOrgId,
      upset: winner.seed > favoriteSeed,
    };
  }

  public getStandings(period?: SearchPeriod): Standing[] {
    const usedGames = this.getGamesInTimePeriod(period);
    const standings = this.players.map((playerPicks) => {
      const gameResults = usedGames.map((game) => this.getGameResults(game));
      const standing: Standing = {
        playerId: playerPicks.id,
        score: 0,
        correctPicks: 0,
        upsets: 0,
      };
      for (const result of gameResults) {
        const pick = playerPicks.picks[result.contestId];
        if (result.winnerId === pick) {
          standing.score += this.poolConfig.scoring[result.round];
          standing.correctPicks += 1;
          if (result.upset) {
            standing.upsets += 1;
          }
        }
      }
      return standing;
    });
    return standings.sort((player1Standing, player2Standing) => {
      const scoreDiff = player2Standing.score - player1Standing.score;
      if (scoreDiff !== 0) {
        return scoreDiff;
      }
      const upsetDiff = player2Standing.upsets - player1Standing.upsets;
      if (upsetDiff !== 0) {
        return upsetDiff;
      }
      const correctPicksDiff =
        player2Standing.correctPicks - player1Standing.correctPicks;
      if (correctPicksDiff !== 0) {
        return correctPicksDiff;
      }
      return 0;
    });
  }

  public getGamesInTimePeriod(period?: SearchPeriod) {
    if (!period) {
      return this.games;
    }
    return this.games.filter((game) => {
      const gameTimeMS = game.startTimeEpoch * 1000;
      if (period.start && gameTimeMS < period.start.getTime()) {
        return false;
      } else if (period.end && gameTimeMS > period.end.getTime()) {
        return false;
      }
      return true;
    });
  }

  public getGamesOfConsequence(period?: SearchPeriod): GameOfConsequenceData[] {
    const games = this.getGamesInTimePeriod(period);
    return games
      .map((game) => ({
        time: new Date(game.startTimeEpoch * 1000),
        pickInfo: game.teams.map((team) => {
          const pickers = this.players
            .filter((playerPicks) => {
              const pick = playerPicks.picks[game.contestId];
              return pick === team.ncaaOrgId;
            })
            .map((pickerBracket) => pickerBracket.id);
          return {
            pickers,
            teamId: team.ncaaOrgId,
            seed: team.seed,
            color: team.color,
            name: team.nameShort,
          };
        }),
      }))
      .sort((game1, game2) => game1.time.getTime() - game2.time.getTime());
  }

  public addOrUpdatePicks(playerId: string, picks: Player["picks"]) {
    const existingPlayer = this.getPlayerById(playerId);
    if (existingPlayer) {
      existingPlayer.picks = picks;
    } else {
      this.players.push({ id: playerId, picks });
    }
  }

  public getPlayerById(playerId: string): Player | undefined {
    return this.players.find((picks) => picks.id === playerId);
  }

  public getTeams() {
    return this.games.reduce((acc, game) => {
      for (const team of game.teams) {
        acc[team.ncaaOrgId] = team;
      }
      return acc;
    }, {} as { [orgId: number]: Team });
  }
}
