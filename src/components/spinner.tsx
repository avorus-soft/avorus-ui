import React, { useEffect, useState, useRef } from 'react'
import { Tooltip, Typography } from '@mui/material'
import { onSnapshot } from 'mobx-state-tree'
import { useStores } from '../models'

const charList = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'].reverse()

const Spinner = () => {
  const rootStore = useStores()

  const [i, setI] = useState(0)
  const [_, setNumUpdates] = useState(0)
  const [dataRate, setDataRate] = useState(0)

  useEffect(() => {
    let handle
    const _dispose = onSnapshot(rootStore.dataStore.devices, () => {
      cancelAnimationFrame(handle)
      handle = requestAnimationFrame(() => {
        setI(val => (val + 1) % charList.length)
        setNumUpdates(prevNumUpdates => prevNumUpdates + 1)
      })
    })
    return _dispose
  })

  useEffect(() => {
    const updateDataRate = dt => {
      setNumUpdates(numUpdates => {
        setDataRate(lastDataRate => {
          const curDataRate = numUpdates / (dt / 1e6)
          return (
            lastDataRate +
            (curDataRate - lastDataRate) *
              (curDataRate > lastDataRate ? 0.5 : 0.01)
          )
        })
        return 0
      })
      handle = requestAnimationFrame(updateDataRate)
    }
    let handle = requestAnimationFrame(updateDataRate)
    return () => cancelAnimationFrame(handle)
  }, [])

  return (
    <Tooltip title={`${dataRate.toFixed(1)} updates/sec`}>
      <Typography
        sx={{
          userSelect: 'none',
          fontFamily: 'monospace',
          marginLeft: '.5rem',
        }}
      >
        {charList[i]}
      </Typography>
    </Tooltip>
  )
}

export default Spinner
