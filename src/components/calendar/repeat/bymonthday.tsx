import React, { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

const days = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
]

const ByMonthDay = ({
  value = [],
  onChange,
}: {
  value: number | Array<number>
  onChange: (arg0: Array<number>) => void
}) => {
  if (value === null) {
    onChange([])
    return
  }
  if (typeof value === 'number') {
    onChange([value])
    return null
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Day</InputLabel>
      <Select
        value={value}
        onChange={({ target }) => onChange(target.value as Array<number>)}
        multiple
        label="Day"
        variant="standard"
        fullWidth
      >
        {days.map((day, value) => (
          <MenuItem key={day} value={value}>
            {day}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ByMonthDay
