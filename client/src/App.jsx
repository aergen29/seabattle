import { ThemeProvider } from "@mui/material";
import React from "react";
import { darkTheme, lightTheme } from "./helper/themes";
import ContainerGlobal from "./component/ContainerGlobal";
import { Routes, Route } from "react-router-dom";

const App = () => {
  const isDark = true;
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Routes>
        <Route path="/" element={<ContainerGlobal />} />
        <Route path="/:room" element={<ContainerGlobal />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
