import { Theme } from "../types/theme";

export const LightTheme = {
  palette: {
    background: "rgb(255, 255, 255)",
    correct: { default: "rgb(19, 134, 61)", light: "rgba(19, 134, 61, 0.05)" },
    incorrect: {
      default: "rgb(204, 60, 60)",
      light: "rgba(204, 60, 60, 0.05)",
    },
    neutral: {
      default: "rgb(212, 212, 212)",
      light: "rgb(212, 212, 212, 0.5)",
    },
  },
} as const satisfies Theme;
