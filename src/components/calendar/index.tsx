import React, { useState, useCallback, useRef, useEffect } from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { Paper } from '@mui/material'
import FullCalendar from '@fullcalendar/react'
import { CalendarOptions, EventInput } from '@fullcalendar/core'
import deLocale from '@fullcalendar/core/locales/de'
import momentPlugin, { toMoment } from '@fullcalendar/moment'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment, { Moment } from 'moment'
import { RRule } from 'rrule'
import { useStores } from '../../models'
import { toJS, values } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Startup } from '../../containers'
import { Event } from '../../models/EventStore'
import EventDialog from './event'
import EventContent from './eventContent'
import Config from '../../config'

const fullCalendarProps: CalendarOptions = {
  height: '100%',
  locale: deLocale,
  timeZone: Config.timeZone,
  scrollTime: '09:00:00',
  defaultTimedEventDuration: { hours: 1 },
  defaultAllDayEventDuration: { days: 1 },
  droppable: true,
  editable: true,
  nowIndicator: true,
  forceEventDuration: true,
  plugins: [
    momentPlugin,
    momentTimezonePlugin,
    rrulePlugin,
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ],
  headerToolbar: {
    left: 'prev,today,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek',
  },
}

const Calendar = ({ path }) => {
  const { eventStore } = useStores()
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedEvent, setSelectedEvent] = useState<{
    id?: string
    start: Moment
    end: Moment
    rrule?: string
    allDay?: boolean
    extendedProps?: any
    remove?: CallableFunction
  } | null>(null)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const events = values(eventStore.events).map(event =>
    toJS(event),
  ) as unknown as ReadonlyArray<Event>

  useEffect(() => {
    eventStore.fetchEvents()
  }, [eventStore])

  const commitEvent = useCallback(
    (event: any, rrule?: string | null) => {
      const calendarApi = calendarRef.current.getApi()
      const start = toMoment(event.start, calendarApi)
      let end: Moment
      if (!event.end) {
        end = moment(events.find(({ id }) => id === event.id).end)
      } else {
        end = toMoment(event.end, calendarApi)
      }
      let _rrule: RRule | null
      let duration: number | null
      if (rrule) {
        const rruleOptions = RRule.parseString(rrule)
        rruleOptions.dtstart = start
          .clone()
          .utc()
          .add(start.utcOffset(), 'm')
          .toDate()
        _rrule = new RRule({
          ...rruleOptions,
          byhour: null,
          tzid: Config.timeZone,
        })
        duration = moment.duration(end.diff(start)).asMilliseconds()
      }
      event = event.toPlainObject ? event.toPlainObject() : event
      const e: Event = {
        ...event,
        start: start.format(),
        end: end.format(),
        rrule: _rrule?.toString(),
        duration,
        extendedProps: {
          ...event.extendedProps,
          actions: event.extendedProps.actions || Config.defaultEventActions,
        },
      }
      eventStore.commitEvent(e)
    },
    [events, eventStore],
  )

  const handleDialogClose = useCallback(
    event => {
      setIsOpenDialog(false)
      setSelectedEvent(null)
      if (event) {
        commitEvent(
          {
            ...event,
            start: moment(event.start).format(),
            end: moment(event.end).format(),
          },
          event.rrule,
        )
      }
    },
    [commitEvent],
  )

  const handleDateClick = useCallback(({ date, allDay }) => {
    const start = toMoment(date, calendarRef.current.getApi())
    const end = start.clone().add(1, allDay ? 'd' : 'h')
    setSelectedEvent({
      start,
      end,
      allDay: allDay,
      extendedProps: null,
    })
    setIsOpenDialog(true)
  }, [])

  const handleEventClick = useCallback(
    ({ event }) => {
      const calendarApi = calendarRef.current.getApi()
      const selectedEvent = events.find(({ id }) => id === event.id)
      setSelectedEvent({
        ...selectedEvent,
        start: toMoment(new Date(selectedEvent.start), calendarApi),
        end: toMoment(new Date(selectedEvent.end), calendarApi),
        rrule: selectedEvent.rrule,
        remove: () => {
          eventStore.removeEvent(event)
          setIsOpenDialog(false)
        },
      })
      setIsOpenDialog(true)
    },
    [events, eventStore],
  )

  const handleEventChange = useCallback(
    ({ event }) => {
      const selectedEvent = events.find(({ id }) => id === event.id)
      // console.log(event.start, event.end)
      const changedEvent = event.toPlainObject()
      const e = {
        ...selectedEvent,
        ...changedEvent,
        rrule: null,
      }
      e.end = e.end || moment(selectedEvent.end).format()
      commitEvent(e, selectedEvent.rrule)
    },
    [events, commitEvent],
  )

  if (eventStore.isLoading) {
    return (
      <MosaicWindow title="Calendar" path={path}>
        <Startup />
      </MosaicWindow>
    )
  }

  return (
    <MosaicWindow title="Calendar" path={path}>
      <Paper style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ height: '100%', minHeight: 700 }}>
          <FullCalendar
            {...fullCalendarProps}
            ref={calendarRef}
            loading={() => eventStore.isLoading}
            events={[...events]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            eventReceive={({ event }) => {
              commitEvent(event)
            }}
            eventContent={props => {
              const event = events.find(({ id }) => id === props.event.id)
              if (!event) {
                return null
              }
              return (
                <EventContent
                  {...props}
                  event={props.event}
                  calendarRef={calendarRef}
                />
              )
            }}
          />
        </div>
      </Paper>
      <EventDialog
        open={isOpenDialog}
        onClose={(event: EventInput | null) => handleDialogClose(event)}
        {...selectedEvent}
      />
    </MosaicWindow>
  )
}

export default observer(Calendar)
