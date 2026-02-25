import React from "react";
import { Box, Typography } from "@mui/material";
import SimpleTable, {
  SimpleTableColumnFormat,
} from "../components/SimpleTable/SimpleTable";

interface DummyItem {
  place: number;
  user: string;
  points: number;
  upsets: number;
}

const TypographyDisplay = (value: string | number): React.ReactNode => (
  <Typography>{value}</Typography>
);

const tableFormat: SimpleTableColumnFormat<keyof DummyItem, DummyItem>[] = [
  {
    id: "place",
    display: TypographyDisplay,
    header: "Place",
    width: "1fr",
  },
  {
    id: "user",
    display: TypographyDisplay,
    header: "Player",
    width: "1fr",
  },
  {
    id: "points",
    display: TypographyDisplay,
    header: "Points",
    width: "1fr",
  },
  {
    id: "upsets",
    display: TypographyDisplay,
    header: "Upsets",
    width: "1fr",
  },
];

const items: DummyItem[] = [
  {
    place: 1,
    points: 2,
    user: "Kevin 1",
    upsets: 4,
  },
  {
    place: 2,
    points: 3,
    user: "Kevin 2",
    upsets: 4,
  },
  {
    place: 3,
    points: 4,
    user: "Kevin 3",
    upsets: 5,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
  {
    place: 4,
    points: 5,
    user: "Kevin 4",
    upsets: 6,
  },
];

export const StandingsPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "2rem",
        overflow: "hidden",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <SimpleTable format={tableFormat} items={items} />
    </Box>
  );
};

export default StandingsPage;
