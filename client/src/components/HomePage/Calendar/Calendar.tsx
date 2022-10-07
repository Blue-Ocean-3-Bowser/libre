import React, { useEffect, useReducer, useState } from 'react';

import "@fullcalendar/react/dist/vdom";
import FullCalendar from '@fullcalendar/react'
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { connect } from 'react-redux';

import { useDisclosure } from '@chakra-ui/react'
import _ from 'underscore';
import styles from './Calendar.module.css';
import NewEventForm from './NewEventForm';
import EventDetails from './EventDetails';
import { getEvents } from '../../Utilities/http';
import { ParsedEvent, parseEvents, parseInfo, setInverseBg } from '../../Utilities/parser';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../configs/config';

export interface DateRange {
  start: string | null,
  end: string | null
}

const initialState = {
  dateRange: {start: null, end: null},
  ownEvents: [],
  friendEvents: {},
  currEvents: [],
  clicked: {
    title: null,
    start: null,
    end: null,
    extendedProps: {
      organizer: null,
      attendees: [],
      location: null,
      description: null,
    },
    color: null
  }
}

const Calendar = (props) => {
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const [state, setState] = useReducer((state, newState) => ({...state, ...newState}),
  initialState);

  const { currUser, attendees } = props;

  const [calendarDisplayName, setCalendarDisplayName] = useState('');

  useEffect(() => {
    if (state.dateRange.start && currUser) {
      getEvents(currUser.email, state.dateRange, currUser.oauthAccessToken)
        .then((res) => {
          let parsed = parseEvents(res);
          let combined = currUser.events.concat(parsed)
          const uniqueEvents = [];

          const unique = combined.filter(event => {
            const isDuplicate = uniqueEvents.includes(event.id);
            if (!isDuplicate) {
              uniqueEvents.push(event.id);
              return true;
            }
            return false;
          });

          currUser.events = unique;

          setDoc(doc(db, "users", currUser.email), currUser)

          setState({
            ownEvents: parsed,
            currEvents: parsed
          })
        })
    }

    const nameArr = currUser.displayName.split(' ');
    setCalendarDisplayName(nameArr[0]);
  }, [state.dateRange])

  useEffect(() => {
    let friendEvents = attendees.map(({ events }) => events);
    setInverseBg(currUser.events)
  }, [attendees])

  return (
    <div className={styles.calendar} id="calendar">
      <h2 className={styles.displayName}>{calendarDisplayName}'s Calendar</h2>
      <div className={styles.calendarMain}>
        <NewEventForm isOpen={isFormOpen} onClose={onFormClose}/>
        <EventDetails detail={state.clicked} isOpen={isDetailOpen} onClose={onDetailClose}/>
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
          events={state.currEvents}
          select={onFormOpen}
          eventClick={(info) => {
            onDetailOpen();
            setState({
              clicked: parseInfo(info.event)
            })
          }}
          datesSet={(dateInfo) => {
            setState(
              {dateRange:{
                start: new Date(dateInfo.start).toISOString(),
                end: new Date(dateInfo.end).toISOString()
            }})
        }}
          />
      </div>
    </div>
  )
}

function mapStatetoProps(state) {
  const { currUser, attendees } = state;
  return { currUser, attendees };
};


const mapDispatchToProps = {};

export default connect(mapStatetoProps, mapDispatchToProps)(Calendar);


