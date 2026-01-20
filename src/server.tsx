import express from "express";
import ReactDOMServer from "react-dom/server";
import HTMLRoot from "./components/HTMLRoot";
import React from "react";
import Standings from "./components/Standings";
import { Pool } from "./pool";
import { CONFIG } from "./config";
import GamesOfConsequence from "./components/GamesOfConsequence";

const app = express();
const port = 3000;

const SSR = (title: string, component: React.ReactNode) =>
  ReactDOMServer.renderToString(<HTMLRoot title={title}>{component}</HTMLRoot>);

app.get("/", (req, res) => {
  res.send("Hello from the Cherry March Madness API!");
});

app.get("/standings", async (req, res) => {
  console.log(
    `${new Date().toLocaleString("en-US", {
      timeZone: "America/Toronto",
    })}: Standings accessed by ${req.ip}`
  );
  const pool = new Pool(CONFIG);
  await pool.load();
  res.send(
    SSR(
      "Standings",
      <Standings standings={pool.getStandings({ end: new Date() })} />
    )
  );
});

app.get("/goc", async (req, res) => {
  console.log(
    `${new Date().toLocaleString("en-US", {
      timeZone: "America/Toronto",
    })}: Games of Consequence accessed by ${req.ip}`
  );
  const pool = new Pool(CONFIG);
  await pool.load();
  res.send(
    SSR(
      "Games Of Consequence",
      <GamesOfConsequence
        gocData={pool.getGamesOfConsequence()}
      ></GamesOfConsequence>
    )
  );
});

app.listen(3000, () => {
  console.log(`March Madness Standings available on port ${port}`);
});
