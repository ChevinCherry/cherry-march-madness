import axios from "axios";
import fs from "fs";
import path from "path";
import { Game, MMLScoresBracketWebPayload } from "./types/mml";
import { CONFIG } from "./config";

class MMLAPI {
  public static async getGames(test?: boolean): Promise<Game[]> {
    let payload: MMLScoresBracketWebPayload;
    if (test) {
      payload = JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, "../test-data/e.json"))
          .toString()
      );
    } else {
      const res = await axios.get(CONFIG.scoresURL);
      payload = res.data as MMLScoresBracketWebPayload;
    }

    return payload.data.mmlContests as Game[];
  }
}

export default MMLAPI;
