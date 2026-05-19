export interface ThemePalette {
  background: string;
  neutral: {
    default: string;
    light: string;
  };
  correct: {
    default: string;
    light: string;
  };
  incorrect: {
    default: string;
    light: string;
  };
}

export interface Theme {
  palette: ThemePalette;
}
