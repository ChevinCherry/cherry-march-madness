import { Game } from "./mml";

/**
 * Game ID -> Predicted Winner ID
 */

export interface Player {
  id: string;
  picks: { [contestId: number]: number };
}

export interface PoolConfig {
  scoresURL: string;
  bracketsPath: string;
  scoring: {
    [roundNumber: number]: number;
  };
}

export interface Standing {
  playerId: string;
  score: number;
  upsets: number;
  correctPicks: number;
}

export interface SearchPeriod {
  start?: Date;
  end?: Date;
}

export interface GameOfConsequenceData {
  time: Date;
  pickInfo: {
    teamId: number;
    seed: number;
    name: string;
    color: string;
    pickers: string[];
  }[];
}

export interface BracketGame {
  to: BracketGame | null;
  from: BracketGame[];
  gameData: Game;
}
