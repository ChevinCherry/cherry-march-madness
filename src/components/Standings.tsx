import React from "react";
import { Standing } from "../types/pool";

interface StandingsProps {
  standings: Standing[];
}

const rowStyles: React.CSSProperties = {
  fontFamily: "sans-serif",
  fontWeight: "bolder",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  borderBottom: "1px solid gray",
  padding: "8px",
};
const colStyles: React.CSSProperties = {
  paddingRight: "16px",
  alignContent: "center",
};

const secondaryScoreColStyles: React.CSSProperties = {
  ...colStyles,
  color: "black",
};

const scoreColStyles: React.CSSProperties = {
  ...colStyles,
  fontWeight: "900",
  color: "black",
};

const Standings = (props: StandingsProps) => {
  const { standings } = props;
  const tiers: Standing[][] = [];
  let currentTier: Standing[] = [];
  let currentTierStanding: Standing | undefined = undefined;
  for (const standing of standings) {
    if (!currentTier || !currentTierStanding) {
      currentTier = [standing];
      currentTierStanding = standing;
    } else if (
      currentTierStanding.score === standing.score &&
      currentTierStanding.upsets === standing.upsets &&
      currentTierStanding.correctPicks === standing.correctPicks
    ) {
      currentTier.push(standing);
    } else {
      tiers.push(currentTier);
      currentTier = [standing];
      currentTierStanding = standing;
    }
  }
  tiers.push(currentTier);
  let currentPlace = 1;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        height: "100%",
      }}
    >
      <div style={{ ...rowStyles, borderBottom: "2px solid black" }}>
        <div style={colStyles}>Place</div>
        <div style={colStyles}>Player</div>
        <div style={scoreColStyles}>Score</div>
        <div style={secondaryScoreColStyles}>Upsets</div>
        <div style={secondaryScoreColStyles}>Correct Picks</div>
      </div>
      {tiers.flatMap((tier) => {
        const standingElems = tier.map((standing) => (
          <div
            style={{
              ...rowStyles,
              backgroundColor:
                currentPlace === 1
                  ? "#ffc730"
                  : currentPlace === 2
                  ? "#c4d4e0"
                  : currentPlace === 3
                  ? "#cd7f32"
                  : "#ffffff",
            }}
          >
            <div style={colStyles}>
              {tier.length > 1 ? "T" + currentPlace : currentPlace}
            </div>
            <div style={colStyles}>{standing.playerId}</div>
            <div style={scoreColStyles}>{standing.score}</div>
            <div style={secondaryScoreColStyles}>{standing.upsets}</div>
            <div style={secondaryScoreColStyles}>{standing.correctPicks}</div>
          </div>
        ));
        currentPlace += standingElems.length;
        return standingElems;
      })}
    </div>
  );
};

export default Standings;
