import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../../configs/config';
import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';
import { BsXLg } from 'react-icons/bs'
import { GiCheckMark } from 'react-icons/gi'
import { Avatar, IconButton } from '@chakra-ui/react'
import axios from 'axios';
import { signin } from '../../../../redux/actions/currUser';
import { connect } from 'react-redux';

const Notification = (props) => {
  const { signin, currUser, document, currEvent, getAllDocs, currPhoto } = props;
  const { email, oauthAccessToken } = currUser;
  const { senderDisplayName, senderEmail, type, eventName, id } = document

  console.log(currEvent)

  const acceptRequest = () => {
    const docRef = doc(db, 'notifications', id)
    const data = {
      status: 'accepted'
    }
    updateDoc(docRef, data)
      .then(() => {
        console.log('accept event successful')
        getAllDocs()
      })
      .catch((err) => {
        console.log('did not update :', err)
      })

    if (type === 'friend-request') {
      const userRef = doc(db, 'users', email)
      getDoc(userRef)
        .then((userData: any) => {
          const friends = userData.data().friends.slice()
          friends.push(document.senderEmail)
          updateDoc(userRef, { friends: friends })
          getDoc(doc(db, "users", currUser.email))
          .then((userData) => {
            signin({...userData.data()});
          })
        })
        .catch(err => console.log(err))
      const senderRef = doc(db, 'users', senderEmail)
      getDoc(senderRef)
        .then((userData: any) => {
          const friends = userData.data().friends.slice()
          friends.push(currUser.email)
          updateDoc(senderRef, { friends: friends })
        })
    }

    if (type === 'event-invitation') {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${currUser.email}/events`;
      // get variables from database
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
      }
      return axios.put(url, requestBody, requestConfig)
    }
  }

  const declineRequest = async () => {
    const docRef = doc(db, 'notifications', id)
    const data = {
      status: 'declined'
    }
    updateDoc(docRef, data)
      .then(() => {
        console.log('decline event request successful')
        getAllDocs();
      })
        .catch((err) => {
          console.log('did not update:', err)
        })
  }

  return (
    <div className={styles.notificationCard}>
      <div className={styles.notificationHeader}>
        <Avatar name={senderDisplayName} src={currPhoto} size="md"/>
        {type === 'event-invitation' ?
          <p className={styles.notificationHeaderText}>
            <span className={styles.senderDisplayName}><b>{senderDisplayName}</b></span>
            sent an invitation to
            <b> {eventName}</b>
          </p>
          :
          <p>
            <span className={styles.senderDisplayName}>
              <b>{senderDisplayName}</b>
            </span><span className={styles.textStyles}>sent you a <b>friend request</b>!</span>
          </p>
        }
      </div>
      <hr className={styles.divider} />
      <div className={styles.notificationButtons}>
        <IconButton
          variant='outline'
          colorScheme='orange'
          aria-label='Accept Button'
          fontSize='18px'
          size='sm'
          icon={<GiCheckMark />}
          onClick={acceptRequest}
        />
        <IconButton
          variant='outline'
          colorScheme='orange'
          aria-label='Decline Button'
          fontSize='18px'
          size='sm'
          icon={<BsXLg />}
          onClick={declineRequest}
        />
      </div>
    </div>
  )
}

function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

const mapDispatchToProps = { signin };

export default connect(mapStatetoProps, mapDispatchToProps)(Notification);