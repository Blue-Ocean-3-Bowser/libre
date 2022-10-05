import React from "react";
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
  Stack,
  HStack,
  VStack,
  Flex,
  Spacer
} from '@chakra-ui/react';

import styles from './Calendar.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewEventForm = ({isOpen, onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id={styles.newEventForm}>
              {/* <VStack className={styles.red} spacing='1.75rem'> */}
                <Flex wrap="wrap" gap="1.75rem">
                  <label className={styles.red}>Event name:<input className={styles.input} type="text" name="eventName" required></input></label>
                  <label className={styles.red}>Start time:
                    <input
                      className={styles.input}
                      type="datetime-local"
                      id="event-start-time"
                      name="event-start-time"
                      required
                      ></input>
                  </label>
                  <label className={styles.red}>End time:
                    <input
                      className={styles.input}
                      type="datetime-local"
                      id="event-start-time"
                      name="event-start-time"
                      required
                      ></input>
                  </label>
                  <label className={styles.red}>Location:<input className={styles.input} type="text" name="eventLocation" required></input></label>
                  <label className={styles.red}>Description:<textarea className={styles.input} name="eventDescription" required></textarea></label>
                </Flex>
                {/* <label>Description:<input className={styles.description} type="text" name="eventDescription" required></input></label> */}
              {/* </VStack> */}
            </form>
          </ModalBody>
          {/* <HStack> */}
            <Flex justify="center">
              <button className={styles.button}>Submit</button>
              <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>Cancel</button>
            </Flex>
          {/* </HStack> */}
        </ModalContent>
      </Modal>
  )
}

export default NewEventForm;