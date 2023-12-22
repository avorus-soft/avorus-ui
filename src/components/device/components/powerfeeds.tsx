import React, { useMemo } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { api } from '../../../services/api'
import { observer } from 'mobx-react-lite'
import { Box } from '@mui/material'
import { green, red } from '@mui/material/colors'

const Powerfeeds = observer<any>(({ id, powerfeeds }) => {
  const numCoils = useMemo(() => powerfeeds.length, [powerfeeds])

  const handleChange = (coil: number, value: string) => {
    api.action({
      type: 'device',
      action: 'write_powerfeed',
      data: {
        data: {
          id,
        },
        params: { id: coil, value: value === 'on' },
      },
    })
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(6, 1fr)`,
        gap: '5px',
      }}
    >
      {powerfeeds.slice(0, numCoils).map((value, i) => (
        <FormControl key={`pf_${id}_${i}`} fullWidth variant="standard">
          <InputLabel id="demo-simple-select-label">Feed {i}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value ? 'on' : 'off'}
            color={value ? 'success' : 'error'}
            label={`Feed ${i}`}
            onChange={(event: SelectChangeEvent) =>
              handleChange(i, event.target.value)
            }
            sx={{ color: value ? green[500] : red[500] }}
          >
            <MenuItem value="on">On</MenuItem>
            <MenuItem value="off">Off</MenuItem>
          </Select>
        </FormControl>
      ))}
    </Box>
  )
})

export default Powerfeeds
