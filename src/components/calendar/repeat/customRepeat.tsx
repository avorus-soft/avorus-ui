import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  FormGroup,
  FormLabel,
  Input,
  List,
  ListItem,
  MenuItem,
  Select,
} from '@mui/material'
import { Options, ByWeekday as ByWeekdayType } from 'rrule'
import ByWeekday from './byweekday'
import End from './end'
import ByMonth from './bymonth'
import ByMonthDay from './bymonthday'

const computeState = value => ({
  ...value,
  freq: Math.min(value.freq, 3),
})

const CustomRepeat = ({
  open,
  handleClose,
  value,
  onChange,
}: {
  open: boolean
  handleClose: () => void
  value: Options
  onChange: (arg0: Options) => void
}) => {
  const [intervalIsValid, setIntervalIsValid] = useState(true)
  const [state, setState] = useState<Options>(computeState(value))

  useEffect(() => {
    setState(computeState(value))
  }, [value])

  const save = useCallback(() => {
    onChange(state)
    handleClose()
  }, [onChange, handleClose, state])

  useEffect(() => {
    setIntervalIsValid(state.interval > 0)
  }, [state.interval])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Custom recurrence</DialogTitle>
      <List>
        <ListItem>
          <FormGroup>
            <FormLabel>Repeat every</FormLabel>
            <FormGroup row>
              <Input
                type="number"
                defaultValue={1}
                value={state.interval}
                color={intervalIsValid ? 'primary' : 'error'}
                onChange={({ target }) =>
                  setState({
                    ...state,
                    interval: Number(target.value),
                  })
                }
                sx={{ width: '3rem', input: { textAlign: 'center' } }}
              />
              <Select
                variant="standard"
                value={state.freq}
                onChange={({ target }) => {
                  const freq = Number(target.value)
                  setState({
                    ...state,
                    freq,
                  })
                }}
                autoWidth
              >
                <MenuItem value={3}>
                  Day{state.interval > 1 ? 's' : ''}
                </MenuItem>
                <MenuItem value={2}>
                  Week{state.interval > 1 ? 's' : ''}
                </MenuItem>
                <MenuItem value={1}>
                  Month{state.interval > 1 ? 's' : ''}
                </MenuItem>
                <MenuItem value={0}>
                  Year{state.interval > 1 ? 's' : ''}
                </MenuItem>
              </Select>
            </FormGroup>
          </FormGroup>
        </ListItem>
        <ListItem>
          <ByWeekday
            value={state.byweekday as Array<ByWeekdayType>}
            onChange={byweekday => {
              setState({ ...state, byweekday })
            }}
          />
        </ListItem>
        <ListItem>
          <FormGroup row sx={{ width: '100%', flexWrap: 'nowrap' }}>
            <ByMonthDay
              value={state.bymonthday}
              onChange={bymonthday => setState({ ...state, bymonthday })}
            />
            <ByMonth
              value={state.bymonth}
              onChange={bymonth => setState({ ...state, bymonth })}
            />
          </FormGroup>
        </ListItem>
        <ListItem>
          <End value={state} onChange={value => setState(value)} />
        </ListItem>
        <ListItem>
          <ButtonGroup variant="text" fullWidth>
            <Button color="primary" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button color="success" onClick={save}>
              Save
            </Button>
          </ButtonGroup>
        </ListItem>
      </List>
    </Dialog>
  )
}
export default CustomRepeat
