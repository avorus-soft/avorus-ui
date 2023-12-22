import React, { memo, MutableRefObject } from 'react'
import { Tooltip } from '@mui/material'
import FullCalendar from '@fullcalendar/react'
import moment from 'moment'
import { OptionIcon } from './items'
import { toMoment } from '@fullcalendar/moment'

interface EventContentProps {
  event: any
  calendarRef: MutableRefObject<FullCalendar>
}

const EventContent = memo(({ event, calendarRef }: EventContentProps) => {
  if (!calendarRef.current) {
    return null
  }
  const { title, start, end, allDay, extendedProps } = event
  const api = calendarRef.current.getApi()
  const mStart = toMoment(start, api)
  const mEnd = toMoment(end, api)
  let format: string
  if (allDay) {
    format = 'DD.MM'
  } else {
    if (mEnd.day() !== mStart.day()) {
      format = 'DD.MM HH:mm'
    } else {
      format = 'HH:mm'
    }
  }
  const _start = mStart.format(format)
  const _end = mEnd.format(format)
  const tooltipTitle = () => (
    <>
      <div>{`${_start}-${_end}`}</div>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        <OptionIcon type={extendedProps.type} />
        {`${title} (${extendedProps.description})`}
      </div>
    </>
  )
  return (
    <Tooltip title={tooltipTitle()} disableInteractive>
      <div style={{ height: '100%' }}>
        <div
          style={{
            height: 'fit-content',
            maxHeight: '100%',
            position: 'sticky',
            top: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'start',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0 3px',
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>{_start}</span>-
          <span style={{ whiteSpace: 'nowrap' }}>{_end}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <OptionIcon type={extendedProps.type} />
            <span>{title}</span>
          </div>
        </div>
      </div>
    </Tooltip>
  )
})

export default EventContent
