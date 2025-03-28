import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      card: "#0F1215",
      main: "#000",
      grid:"#1e1e1e",
      gridBorder:"#959595",
      opposite:"gray"
    },
    primary: {
      dark: "#7c0b20",
      main: "#b2102f",
      light: "#c13f58",
    },
    secondary: {
      dark: "#1c54b2",
      main: "#2979ff",
      light: "#5393ff",
    },
    error: {
      main: red.A400,
    },
    success: {
      main: "#00e676",
    },
    warning: {
      main: "#ffc400",
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#ffffff",
          },
          "& label.Mui-focused": {
            color: "#b2102f",
          },
          "& .MuiInputBase-input": {
            color: "#ffffff",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#b2102f",
            },
            "&:hover fieldset": {
              borderColor: "#c13f58",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#b2102f",
            },
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      main: "#f8fbff",
      card: "#fff",
      grid:"#dfdfdf",
      gridBorder:"1e1e1e",
      opposite: "#000"
    },
    primary: {
      dark: "#7c0b20",
      main: "#b2102f",
      ligh: "#c13f58",
    },
    secondary: {
      dark: "#1c54b2",
      main: "#2979ff",
      ligh: "#5393ff",
    },
    error: {
      main: red.A400,
    },
    success: {
      main: "#00e676",
    },
    warning: {
      main: "#ffc400",
    },
  },
});
