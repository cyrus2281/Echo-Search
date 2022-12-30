import React from "react";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Form from "./Components/Form";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider maxSnack={5}>
      <CssBaseline />
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form />
      </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
