import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs';
import { Button, HStack, useDisclosure, VStack } from '@chakra-ui/react'
import styles from './../Sidebar.module.css'
import FriendEntry from './FriendEntry';
import { connect } from 'react-redux';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../../../../../configs/config';
import AddFriend from './AddFriend';

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

const FriendsList = (props) => {
  const [allFriends, setAllFriends] = useState([]);
  const [friends, setFriends] = useState([]);

  const { currUser } = props;

  useEffect(() => {
    let hold = [];
    currUser.friends.map((friend, i) => {
      getDoc(doc(db, "users", friend))
        .then((res) => {
          const friend = res.data();
          hold.push(friend);
          if (hold.length === currUser.friends.length) {
            setAllFriends(hold);
            setFriends(hold);
          }
        })
        .catch((err) => console.log(err))
    })
  }, [currUser])

  const handleSearch = (e) => {
    let searched = allFriends.filter(({ displayName }) => {
      return displayName.toLowerCase().includes(e.target.value)
    })

    setFriends(searched);
  }

  console.log('FRIENDS', friends);

  return (
    <div className={styles.friendsList}>
      <div className={styles.spacer}></div>
      <div className={styles.friendsListNav}>
        <AddFriend />
          <span className={styles.search}>
            <input
              className={styles.input}
              onChange={(e) => handleSearch(e)}
              type="text"
              placeholder='Search friends list ...'
            ></input>&nbsp;
              <BsSearch size={20}/>
            </span>
            <h2 className={styles.h2}>My Friends</h2>
          </div>
          <VStack className={styles.friendsItems}>
            {
              allFriends.length === 0 ? <p>No friends yet.</p> :
                friends.length ?
                friends.map((friend) =>
                  <FriendEntry key={friend.displayName} friend={friend} />
                )
                : <p>No friends match your search criteria ... {`:(`}</p>
            }
          </VStack>
    </div>
  )
}

function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

const mapDispatchToProps = {};

export default connect(mapStatetoProps, mapDispatchToProps)(FriendsList);
