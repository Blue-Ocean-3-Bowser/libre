import React from "react";
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  HStack,
  VStack,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  doc, setDoc, addDoc, getDoc, collection, writeBatch
} from "firebase/firestore";
import { authentication, db } from '../../../../../configs/config';
import styles from './Calendar.module.css';
import { computeSegDraggable } from "@fullcalendar/react";
import { resolve } from "path";
import { addListener } from "process";
import axios from "axios";
import { format, parseISO } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewEventForm = ({isOpen, onClose, currUser}) => {

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  function onSubmit(values) {

    let { attendees, startTime, endTime, location, name, description } = values;
    const attendeesArray = attendees.split(',')

    startTime = format(parseISO(startTime), "yyyy-MM-dd'T'hh:mm:ss");
    endTime = format(parseISO(endTime), "yyyy-MM-dd'T'hh:mm:ss");

    const url = `https://www.googleapis.com/calendar/v3/calendars/${currUser.email}/events`;
    const requestBody = {
      "end": {
        "dateTime": endTime,
        "timeZone": "America/Los_Angeles"
      },
      "start": {
        "dateTime": startTime,
        "timeZone": "America/Los_Angeles"
      },
      "attendees": attendeesArray,
      "description": description,
      "location": location,
      // "status": "awaiting",
      "summary": name,
      // "iCalUID": "64kebt4dy284mtdekuqn"
    };
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${currUser.oauthAccessToken}`
      }
    };

    // save calendar event into database
    addDoc(collection(db, "events"), {
        hostEmail: currUser.email,
        attendeesArray,
        startTime,
        endTime,
        location,
        description,
      })
      .then((docRef) => {
        for (let i = 0; i < attendeesArray.length; i++) {
          addDoc(collection(db, "notifications"), {
            eventId: docRef.id,
            receiverEmail: attendeesArray[i],
            senderDisplayName: currUser.displayName,
            senderEmail: currUser.email,
            type: 'event-invitation',
            status: 'awaiting',
          })
        }
      })

      // save calendar event into user's Google Calendar
      .then(() => {
        return axios.post(url, requestBody, requestConfig);
      })

      .then(() => {
        onClose();
        alert("Your event has been created!");
      })
      .catch((error) => {
        onClose();
        alert("Your event was not created - please try again!");
      })

  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id={styles.newEventForm} onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing='1.75rem'>
              <FormControl isInvalid={errors.eventName}>
                <FormLabel htmlFor='name' className={styles.red}>
                  Event Name *
                </FormLabel>
                <Input
                  id='name'
                  placeholder='event name'
                  {...register('name', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                  type='text'
                />
                <FormErrorMessage>
                  {errors.eventName && errors.eventName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.attendees}>
                <FormLabel htmlFor='attendees'>
                  Attendees *
                </FormLabel>
                <Input
                  id='attendees'
                  placeholder='who will be attending the event'
                  {...register('attendees', {
                    required: 'This is required',
                  })}
                  type='email'
                  multiple
                  required
                />
                <FormErrorMessage>
                  {errors.eventName && errors.eventName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='startTime'>Event Start Time *</FormLabel>
                <Input
                  id='startTime'
                  placeholder='start time of the event'
                  {...register('startTime', {
                    required: 'This is required',
                  })}
                  type='datetime-local'
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='endTime'>
                  Event End Time *
                </FormLabel>
                <Input
                  id='endTime'
                  placeholder='end time of the event'
                  {...register('endTime', {
                    required: 'This is required',
                  })}
                  type='datetime-local'
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='location'>
                  Location *
                </FormLabel>
                <Input
                  id='location'
                  placeholder='event location'
                  {...register('location', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                  type='text'
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='description'>
                  Description
                </FormLabel>
                <Input
                  id='descroiption'
                  placeholder='event description'
                  {...register('description')}
                  type='text'
                />
              </FormControl>
              <HStack mt={6}>
                <Button
                  className={styles.button}
                  isLoading={isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
                <Button
                  onClick={onClose} type='submit'
                  className={`${styles.button} ${styles.cancel}`}
                >
                  Cancel
                </Button>
              </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
  )
}

// map Redux state
function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

// export default LoginPage;
export default connect(mapStatetoProps, {})(NewEventForm);
