import { ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "./helper/themes";
import ContainerGlobal from "./component/ContainerGlobal";
import { Routes, Route } from "react-router-dom";
import Storage from "./helper/storage";


const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const getInitialDarkMode = ()=>{
    let a = Storage.getMode();
    if(a == null) return prefersDarkMode;
    return a;
  }
  const [theme, setTheme] = useState(getInitialDarkMode()?darkTheme:lightTheme);
  const [isDarkMode,setIsDarkMode] = useState(getInitialDarkMode());
  const changeDarkMode = () => {
    setTheme(!Storage.getMode()?darkTheme:lightTheme);
    setIsDarkMode(!Storage.getMode());
    Storage.changeMode(!Storage.getMode());
  };
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<ContainerGlobal  isDarkMode={isDarkMode} changeDarkMode={changeDarkMode} />} />
        <Route path="/:room" element={<ContainerGlobal  isDarkMode={isDarkMode} changeDarkMode={changeDarkMode} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
