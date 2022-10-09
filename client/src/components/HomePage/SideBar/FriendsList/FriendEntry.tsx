import { Button, HStack, Stack, useDisclosure, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import styles from './FriendsList.module.css';
import { BsChatDots } from 'react-icons/bs';
import{ RiDeleteBin5Line } from 'react-icons/ri'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { connect } from "react-redux";
import { addAttendee, removeAttendee } from "../../../../redux/actions/attendees";
import { toggleSideBar } from "../../../../redux/actions/sideBar";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../../../configs/config";
import { signin } from "../../../../redux/actions/currUser";

const FriendEntry = (props) => {
  const [clicked, setClicked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef()

  const { friend, currUser, addAttendee, removeAttendee, toggleSideBar, setChatWith, signin} = props;

  const handleClick = () => {
    setClicked(!clicked);
    clicked ? removeAttendee(friend) : addAttendee(friend);
  }

  const handleDelete = () => {
    onClose();
    let deletedFriends = currUser.friends.filter((fren) => fren !== friend.email);
    currUser.friends = deletedFriends;
    setDoc(doc(db, "users", currUser.email), currUser)
      .then(() => {
        getDoc(doc(db, "users", currUser.email))
          .then((userData) => {
            signin({...userData.data()});
          })
      })
    removeAttendee(friend);
  }

  return (
    <div className={styles.friendDiv}>
      <HStack className={clicked ? styles.friendClicked : styles.friend}>
        <div><input onClick={() => handleClick()} type="checkbox" className={styles.checkboxRound}></input></div>
        <div style={{width: '100%'}}>
          <p>{friend.displayName}</p>
        </div>
      </HStack>
      <HStack>
        { clicked ?
          <Stack>
            <HStack>
              <Avatar name={friend.displayName} src={friend.photoUrl} />
              {/* <p>{friend.email}</p> */}
            </HStack>
            <HStack>
              <BsChatDots onClick={() => {
                toggleSideBar('chats')
                setChatWith(friend)
                }}/>
                <button onClick={onOpen}><RiDeleteBin5Line /></button>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {friend.displayName} from friends
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme='red' onClick={handleDelete} ml={3}>
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
            </HStack>
          </Stack>
        : null}
      </HStack>
    </div>
  )
}

function mapStatetoProps(state) {
  const { currUser, attendees } = state;
  return { currUser, attendees };
};

const mapDispatchToProps = { signin, addAttendee, removeAttendee, toggleSideBar };

export default connect(mapStatetoProps, mapDispatchToProps)(FriendEntry);