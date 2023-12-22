import React from 'react'
import ReactDOM from 'react-dom/client'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import './index.css'
import App from './App'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: 'IBM Plex Sans',
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <CssBaseline />
        <App />
      </DndProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
