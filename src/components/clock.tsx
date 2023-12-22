import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import moment from 'moment'

const getTime = () => moment(new Date()).format('dd. DD.MM. HH:mm:ss')

const Clock = () => {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(getTime())
    }, 100)
    return () => clearInterval(timeInterval)
  }, [])

  return (
    <Typography
      variant="h5"
      sx={{
        textAlign: 'center',
        background: 'linear-gradient(0deg, #AAAAAA20, #AAAAAA00)',
        borderImage: 'linear-gradient(180deg, #AAAAAA20, #AAAAAA00)',
        borderImageSlice: '1',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 2px 5px 2px #0000000C',
        padding: '0 1rem',
        display: { xs: 'none', md: 'inline-block' },
      }}
    >
      {time}
    </Typography>
  )
}

export default Clock
