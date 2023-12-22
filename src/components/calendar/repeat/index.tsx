import React, { useCallback, useMemo, useState } from 'react'
import {
  Autocomplete,
  createFilterOptions,
  FormGroup,
  IconButton,
  TextField,
} from '@mui/material'
import { RRule } from 'rrule'
import { Moment } from 'moment'
import CustomRepeat from './customRepeat'
import { Settings } from '@mui/icons-material'
import Config from '../../../config'

const filter = createFilterOptions()

const Repeat = ({
  start,
  end,
  onChange,
  value,
}: {
  start: Moment
  end: Moment
  onChange: (arg0: RRule) => void
  value: RRule
}) => {
  const [open, setOpen] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [dialogValue, setDialogValue] = useState<RRule | any>({ byweekday: [] })
  const rruleOptions = useMemo(() => {
    if (!start || !end) {
      return []
    }
    let options: Array<RRule>
    try {
      options = [RRule.YEARLY, RRule.MONTHLY, RRule.WEEKLY, RRule.DAILY].map(
        freq =>
          new RRule({
            freq,
            dtstart: start.clone().utc().add(start.utcOffset(), 'm').toDate(),
            tzid: Config.timeZone,
          }),
      )
    } catch {
      options = []
    }
    if (
      value &&
      !options.map(option => option.toString()).includes(value.toString())
    ) {
      options.splice(0, 0, value)
    }
    return options
  }, [start, end, value])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCustomChange = useCallback(
    value => {
      setDialogValue(value)
      onChange(
        new RRule({
          ...value,
          byhour: null,
          tzid: Config.timeZone,
        }),
      )
    },
    [onChange],
  )

  const filterOptions = useCallback((options, params) => {
    const filtered = filter(options, params) as Array<RRule>
    if (params.inputValue !== '') {
      try {
        const rrule = RRule.fromText(params.inputValue)
        filtered.push(rrule)
        setIsValid(true)
      } catch {
        setIsValid(false)
      }
    }
    return filtered
  }, [])

  const openDialog = useCallback(() => {
    setOpen(() => {
      if (value) {
        const options = value.options
        setDialogValue({
          ...options,
        })
      } else {
        setDialogValue(
          new RRule({
            dtstart: start.toDate(),
            freq: 3,
            byweekday: [start.isoWeekday() - 1],
            tzid: Config.timeZone,
          }).options,
        )
      }
      return true
    })
  }, [start, value])

  return (
    <>
      <Autocomplete
        disabled={!start || !end}
        renderInput={params => (
          <FormGroup row sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton onClick={openDialog}>
              <Settings />
            </IconButton>
            <TextField
              {...params}
              fullWidth={false}
              variant="standard"
              sx={{ flexGrow: 1 }}
              label="Repeat"
            />
          </FormGroup>
        )}
        getOptionLabel={option => option.toText()}
        isOptionEqualToValue={(option, value) =>
          option.toString() === value?.toString()
        }
        options={rruleOptions}
        color={isValid ? 'primary' : 'warning'}
        filterOptions={filterOptions}
        onChange={(_, value) => {
          setTimeout(() => {
            if (value && rruleOptions.indexOf(value) === -1) {
              setOpen(() => {
                setDialogValue(value.options)
                return true
              })
            }
            onChange(value)
          })
        }}
        value={value}
        fullWidth
      />
      <CustomRepeat
        open={open}
        handleClose={() => handleClose()}
        value={dialogValue}
        onChange={value => handleCustomChange(value)}
      />
    </>
  )
}

export default Repeat
