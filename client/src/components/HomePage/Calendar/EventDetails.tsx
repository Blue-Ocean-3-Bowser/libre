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
          <Flex wrap="wrap" gap="1.75rem">
            <p><span style={{fontWeight: "700"}}>Event name:</span> MVP Standup </p>
            <p><span style={{fontWeight: "700"}}>Start time:</span> 10/03/2022 09:30 AM </p>
            <p><span style={{fontWeight: "700"}}>End time:</span> 10/03/2022 10:30 AM </p>
            <p><span style={{fontWeight: "700"}}>Location:</span> Thomas's Google Meet Room</p>
            <p><span style={{fontWeight: "700"}}>Organizer:</span> Thomas Herpner</p>
            <p><span style={{fontWeight: "700"}}>Attendees:</span> Nick -Awaiting, Kat -Going, Allen -Going, Qingzhou -Going, James -Declined, Dan -Declined</p>
          </Flex>
        </ModalBody>
        <Flex justify="center">
          <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>Close</button>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

export default EventDetails;