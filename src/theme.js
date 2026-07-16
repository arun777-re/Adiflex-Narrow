import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1976d2",
    },

    secondary: {
      main: "#009688",
    },

    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;