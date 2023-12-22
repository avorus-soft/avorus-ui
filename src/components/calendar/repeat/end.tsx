import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { Options, RRule } from 'rrule'

const End = ({
  value,
  onChange,
}: {
  value: Options
  onChange: (arg0: Options) => void
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState(value)
  const [untilEnabled, setUntilEnabled] = useState(false)
  const [countEnabled, setCountEnabled] = useState(false)
  const [countIsValid, setCountIsValid] = useState(true)
  const [date, setDate] = useState<Moment>(null)

  useEffect(() => {
    setState(value)
    setUntilEnabled(value.until !== null)
    setCountEnabled(value.count !== null)
    if (value.until !== null) {
      setDate(moment(value.until))
    }
    setIsLoading(false)
  }, [isLoading, value])

  const save = useCallback(() => {
    onChange({
      ...state,
      until: untilEnabled && !!date ? date.toDate() : null,
      count: countEnabled && countIsValid ? state.count : null,
    })
  }, [state, untilEnabled, countEnabled, countIsValid, date, onChange])

  useEffect(() => {
    setCountIsValid(!countEnabled || state.count > 0)
  }, [countEnabled, state.count])

  return (
    <FormGroup>
      <FormLabel>End</FormLabel>
      <FormGroup onBlur={save}>
        <FormGroup row sx={{ alignItems: 'center' }}>
          <Checkbox
            checked={untilEnabled}
            onChange={({ target }) => {
              setUntilEnabled(target.checked)
            }}
            sx={{ height: 'min-content' }}
          />
          <DateTimePicker
            value={date}
            disabled={!untilEnabled}
            onChange={value => {
              setDate(value)
            }}
            minDateTime={moment(state.dtstart)}
          />
        </FormGroup>
        <FormGroup row sx={{ alignItems: 'center' }}>
          <Checkbox
            checked={countEnabled}
            onChange={({ target }) => {
              setCountEnabled(target.checked)
            }}
          />
          After
          <Input
            type="number"
            disabled={!countEnabled}
            color={countIsValid ? 'primary' : 'error'}
            value={state.count}
            onChange={({ target }) => {
              setState({
                ...state,
                count: Number(target.value),
              })
            }}
            sx={{
              width: '3rem',
              input: { textAlign: 'center' },
            }}
          />
          {`time${state.count > 1 ? 's' : ''}`}
        </FormGroup>
      </FormGroup>
    </FormGroup>
  )
}

export default End
