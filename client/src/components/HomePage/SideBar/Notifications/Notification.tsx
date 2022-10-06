import { collection, getDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../../../../configs/config';
import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';
import { BsCheckCircleFill, BsXLg } from 'react-icons/bs'
import { GiCheckMark } from 'react-icons/gi'
import { IconButton } from '@chakra-ui/react'

const Notification = ({ document, currUser, getAllDocs }) => {
  // console.log('document : ', document);
  // const [userData, setUserData] = useState({})
  const [photoUrl, setPhotoUrl] = useState('')
  const { email } = currUser
  const { senderDisplayName, senderEmail, type, eventId } = document

  // update calendar API to either accepted or declined


  // const getPhotoUrl = async () => {
  //   try {
  //     const dbRef = collection(db, 'users')
  //     const users = await getDocs(dbRef)
  //     const temp = {};
  //     users.forEach((user) => {
  //       if (senderEmail === user.data().email) {
  //         setUserData({
  //           user: user.data().email,
  //           url: user.data().photoUrl
  //         })
  //       }
  //       console.log('temp object : ', userData)
  //     })

  //   }
  //   catch (err) {
  //     console.log('could not access users collection: ', err)
  //   }
  // }

  const getPhotoUrl = async () => {
    const userRef = doc(db, 'users', senderEmail)
    await getDoc(userRef)
      .then((userData) => {
        // return <img src={userData.data().photoUrl} />
        console.log('userdata  : ', userData.data())
        userData.data() ?
        setPhotoUrl(userData.data().photoUrl) : null
      })
      .catch(err => console.log(err))
  }

  // getPhotoUrl()

  const acceptRequest = () => {
    const docRef = doc(db, 'notifications', eventId)
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
        })
        .catch(err => console.log(err))
    }
  }

  const declineRequest = async () => {
    const docRef = doc(db, 'notifications', eventId)
    const data = {
      status: 'declined'
    }
    updateDoc(docRef, data)
      .then(() => {
        console.log('decline event request successful')
        getAllDocs()
      })
      .catch((err) => {
        console.log('did not update:', err)
      })
  }

  return (
    <div className={styles.notificationCard}>
      <div className={styles.notificationText}>
        {type === 'event-invitation' ?
          <p>
            <span className={styles.senderDisplayName}><b>{senderDisplayName}</b></span>
            has sent an invitation to
            <b> event name</b>
          </p>
          :
          <p>
            <span className={styles.senderDisplayName}>
              <b>{senderDisplayName}</b>
            </span>has sent you a <b>friend request!</b>
          </p>
        }
      </div>
      <div className={styles.notificationButtons}>
        <IconButton
          variant='outline'
          colorScheme='orange'
          aria-label='Accept Button'
          fontSize='20px'
          size='sm'
          icon={<GiCheckMark />}
          onClick={acceptRequest}
        />
        <IconButton
          variant='outline'
          colorScheme='orange'
          aria-label='Decline Button'
          fontSize='20px'
          size='sm'
          icon={<BsXLg />}
          onClick={declineRequest}
        />
      </div>
    </div>
  )
}

export default Notification;