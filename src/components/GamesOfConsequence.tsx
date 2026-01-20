import React from "react";
import { GameOfConsequenceData, Standing } from "../types/pool";

interface GamesOfConsequenceProps {
  gocData: GameOfConsequenceData[];
}

const GamesOfConsequence = (props: GamesOfConsequenceProps) => {
  const { gocData } = props;
  return (
    <div style={{ fontFamily: "sans-serif", fontWeight: "bolder" }}>
      {gocData.map((goc) => (
        <div style={{ padding: "16px" }}>
          <div>
            {goc.pickInfo.map((team) => team.name).join(" vs. ") +
              " @ " +
              new Date(goc.time).toLocaleString("en-US", {
                timeZone: "America/Toronto",
              })}
          </div>
          <div>
            {goc.pickInfo.map((team) => (
              <div style={{ color: team.color }}>{`${team.name} (${
                team.seed
              }): ${
                team.pickers.length > 0 ? team.pickers.join(", ") : "-"
              }`}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamesOfConsequence;
