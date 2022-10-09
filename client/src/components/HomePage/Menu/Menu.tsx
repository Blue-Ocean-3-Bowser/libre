import React, { useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../../redux/actions/currUser';
import { toggleSideBar } from '../../../redux/actions/sideBar';
import { removeAllAttendees } from '../../../redux/actions/attendees';
import Profile from './Profile/Profile';
import styles from './Menu.module.css';
import { Button, List, ListItem, ListIcon, Link } from '@chakra-ui/react';
import { BiLogOut } from 'react-icons/bi';
import { MdGroups } from 'react-icons/md';
import { BsChatDots, BsCalendar3 } from 'react-icons/bs';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';
import { HiOutlineUserGroup, HiOutlineHome } from 'react-icons/hi';

const Menu = (props) => {
  const { currUser, logout, toggleSideBar, removeAllAttendees } = props;

  function changeSideBar(e, sideBar){
    if(sideBar !== 'friends'){
      removeAllAttendees()
    }
    toggleSideBar(sideBar)
  }

  function handleLogout() {
    //when logout. reset the currUser in redux to null
    logout();
  }

  function handleClickYourCalendar(){
    console.log('handle click aclendar')
    removeAllAttendees()
  }

  return (
    <div className={styles.menu} id="menu">
      <div className={styles.spacer}></div>
      <div className={styles.profile}>
        <Profile currUser={currUser} />
      </div>
      <div className={styles.listContainer}>
        <List spacing={3} >
          <ListItem onClick={handleClickYourCalendar}>
            <ListIcon as={BsCalendar3} />
            <Link>Your Calendar</Link>
          </ListItem>
        <ListItem onClick={(e)=>{changeSideBar(e, 'overview')}}>
          <ListIcon as={HiOutlineHome} />
          <Link>Overview</Link>
        </ListItem>
          <ListItem onClick={(e)=>{changeSideBar(e, 'friends')}}>
            <ListIcon as={FiUsers} />
            <Link>Friends</Link>
          </ListItem>
          <ListItem onClick={(e)=>{changeSideBar(e, 'chats')}}>
            <ListIcon as={BsChatDots} />
            <Link>Chats</Link>
          </ListItem>
          <ListItem onClick={(e)=>{changeSideBar(e, 'notifications')}}>
            <ListIcon  as={IoNotificationsOutline} />
            <Link>Notifications</Link>
          </ListItem>
          <ListItem onClick={handleLogout}>
            <ListIcon as={BiLogOut} />
            <Link>Logout</Link>
          </ListItem>
        </List>
      </div>
    </div>
  )
}

// wrap ui component with redux

// map state
function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

// map methods to update the state
const mapDispatchToProps = { logout, toggleSideBar, removeAllAttendees };

export default connect(mapStatetoProps, mapDispatchToProps)(Menu);