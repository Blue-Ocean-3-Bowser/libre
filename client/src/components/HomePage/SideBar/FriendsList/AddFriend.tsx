import React, { useState } from 'react';
import { Input } from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../../../configs/config';
import { connect } from 'react-redux';

import styles from './FriendsList.module.css';


const AddFriend = (props) => {
  const [newUser, setNewUser] = useState(false);

  const { currUser } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    const input:any = document.getElementById('add-email');
    addDoc(collection(db, "notifications"), {
      receiverEmail: input.value,
      senderDisplayName: currUser.displayName,
      senderEmail: currUser.email,
      type: 'friend-request',
      status: 'awaiting'
    })
    input.value = "";
  }

  return (
    <div className={styles.accordion}>
      <Accordion allowMultiple>
        <AccordionItem>
         <h2>
          <AccordionButton>
            {/* <Box flex='1' textAlign='left'>
              Add Friend
            </Box> */}
            <button className={styles.button}>Add Friend +</button>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <form onSubmit={(e) => handleSubmit(e)}>
            Enter their email: <input className={styles.inviteInput} id="add-email" type="email" required></input>
            <button className={styles.sendInvite} type="submit">Send Invite</button>
          </form>
        </AccordionPanel>
       </AccordionItem>
      </Accordion>
    </div>

  )
}

function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

const mapDispatchToProps = {};

export default connect(mapStatetoProps, mapDispatchToProps)(AddFriend);
