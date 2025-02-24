import { ThemeProvider } from '@mui/material'
import React from 'react'
import { darkTheme, lightTheme } from './helper/themes';
import ContainerGlobal from './component/ContainerGlobal';

const App = () => {
  const isDark = true;
  return (
    <ThemeProvider theme={isDark?darkTheme:lightTheme}>
      <ContainerGlobal/>
    </ThemeProvider>
  )
}

export default App