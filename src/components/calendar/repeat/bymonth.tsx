import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const ByMonth = ({
  value = [],
  onChange,
}: {
  value: number | Array<number>
  onChange: (arg0: Array<number>) => void
}) => {
  if (typeof value === 'number') {
    onChange([value])
    return null
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Month</InputLabel>
      <Select
        value={value === null ? [] : value}
        onChange={({ target }) => onChange(target.value as Array<number>)}
        multiple
        variant="standard"
      >
        {months.map((month, value) => (
          <MenuItem key={month} value={value + 1}>
            {month}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ByMonth
