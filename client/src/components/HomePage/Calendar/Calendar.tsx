import React from 'react';

import "@fullcalendar/react/dist/vdom";
import FullCalendar from '@fullcalendar/react'
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from "moment";

import { useDisclosure } from '@chakra-ui/react'

import styles from './Calendar.module.css';
import NewEventForm from './NewEventForm';
import EventDetails from './EventDetails';


const Calendar = () => {
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  return (
    <div className={styles.calendar} id="calendar">
      <h2>CALENDAR HERE</h2>
      <div className={styles.calendarMain}>
        <NewEventForm isOpen={isFormOpen} onClose={onFormClose} />
        <EventDetails isOpen={isDetailOpen} onClose={onDetailClose}/>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={[
            { title: 'event 1', date: '2022-10-01' },
            { title: 'event 2', date: '2022-10-02' }
          ]}
          select={onFormOpen}
          eventClick={onDetailOpen}
          />
      </div>
    </div>
  )
}

export default Calendar;


