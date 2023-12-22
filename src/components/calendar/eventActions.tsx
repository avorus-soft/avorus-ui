import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useStores } from '../../models'
import { observer } from 'mobx-react-lite'
import { ItemType } from '../../hooks/useActions'
import { CompareArrows } from '@mui/icons-material'

const EventActions = observer(
  ({
    itemType,
    itemId,
    value,
    onChange,
  }: {
    itemType: ItemType | null
    itemId: number | null
    value: { start: string | null; end: string | null } | null
    onChange: CallableFunction
  }) => {
    const { dataStore } = useStores()
    const [start, setStart] = useState(value?.start || '')
    const [end, setEnd] = useState(value?.end || '')
    const options = useMemo(() => {
      if (!itemType) {
        return []
      } else {
        const item = dataStore[`${itemType}s`].get(itemId as any)
        if (!item) {
          return []
        }
        return [...item.capabilities.map(capability => capability)]
      }
    }, [dataStore, itemType, itemId])

    useEffect(() => {
      if (!options.includes(value?.start)) {
        if (value?.start !== '') {
          setStart('')
        }
      } else {
        setStart(value.start)
      }
      if (!options.includes(value?.end)) {
        if (value?.end !== '') {
          setEnd('')
        }
      } else {
        setEnd(value.end)
      }
    }, [options, value])

    useEffect(() => {
      onChange({ start, end })
    }, [onChange, start, end])

    return (
      <FormGroup
        row
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'end',
          gap: '.5rem',
          width: '100%',
        }}
      >
        <FormControl variant="standard" fullWidth>
          <InputLabel id="start-action-label">Start action</InputLabel>
          <Select
            disabled={!options.length}
            labelId="start-action-label"
            label="Start action"
            value={start}
            onChange={({ target }) => setStart(target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {options.map(value => (
              <MenuItem key={`start_${value}`} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          onClick={() => {
            const startval = start
            const endval = end
            setStart(endval)
            setEnd(startval)
          }}
          disabled={!options.length || start === end}
          color="primary"
        >
          <CompareArrows />
        </IconButton>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="end-action-label">End action</InputLabel>
          <Select
            disabled={!options.length}
            labelId="end-action-label"
            label="End action"
            value={end}
            onChange={({ target }) => setEnd(target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {options.map(value => (
              <MenuItem key={`end_${value}`} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormGroup>
    )
  },
)

export default EventActions
