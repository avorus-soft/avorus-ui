import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { HorizontalRule } from '@mui/icons-material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { styled } from 'styled-components'
import { Moment } from 'moment'

const DateRangeContainer = styled.div<{ $small: boolean }>(
  ({ $small }) => `
  flex-grow: 1;
  align-items: center;
  display: flex;
  flex-direction: ${$small ? 'column' : 'row'};
`,
)

const DateRange = ({
  allDay,
  start,
  setStart,
  end,
  setEnd,
}: {
  allDay: boolean
  start: Moment
  end: Moment
  setStart: Dispatch<SetStateAction<Moment>>
  setEnd: Dispatch<SetStateAction<Moment>>
}) => {
  const theme = useTheme()
  const small = useMediaQuery(theme.breakpoints.down('sm'))
  useEffect(() => {
    setEnd(end => {
      if (start && end?.isBefore(start)) {
        return start.clone().add(1, allDay ? 'd' : 'h')
      } else {
        return end
      }
    })
  }, [allDay, start, setEnd])

  const endMinDateTime = useMemo(() => {
    if (allDay) {
      return start?.clone().add('1', 'd')
    } else {
      return start?.clone().add('1', 'm')
    }
  }, [allDay, start])

  if (allDay) {
    return (
      <DateRangeContainer $small={small}>
        <DatePicker
          value={start}
          onChange={setStart}
          maxDate={end}
          sx={{ flexGrow: 1, width: '100%' }}
        />
        <HorizontalRule />
        <DatePicker
          value={end}
          onChange={setEnd}
          minDate={endMinDateTime}
          sx={{ flexGrow: 1, width: '100%' }}
        />
      </DateRangeContainer>
    )
  } else {
    return (
      <DateRangeContainer $small={small}>
        <DateTimePicker
          value={start}
          onChange={setStart}
          maxDate={end}
          sx={{ flexGrow: 1, width: '100%' }}
          minutesStep={1}
        />
        <HorizontalRule />
        <DateTimePicker
          value={end}
          onChange={setEnd}
          minDateTime={endMinDateTime}
          sx={{ flexGrow: 1, width: '100%' }}
          minutesStep={1}
        />
      </DateRangeContainer>
    )
  }
}

export default DateRange
