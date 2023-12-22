import React from 'react'
import { Paper, CircularProgress } from '@mui/material'

const Startup = ({ fullScreen = false }) => {
  return (
    <Paper
      style={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={100} />
    </Paper>
  )
}

export default Startup
