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

const EventDetails = ({isOpen, onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Event name: MVP Standup </p>
          <p>Start time: 10/03/2022 09:30 AM </p>
          <p>End time: 10/03/2022 10:30 AM </p>
          <p>Location: Thomas's Google Meet Room</p>
          <p>Organizer: Thomas Herpner</p>
          <p>Attendees: Nick -Awaiting, Kat -Going, Allen -Going, Qingzhou -Going, James -Declined, Dan -Declined</p>
        </ModalBody>
        <Flex justify="center">
          <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>Close</button>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

export default EventDetails;