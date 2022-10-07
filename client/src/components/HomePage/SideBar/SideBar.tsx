import React, { useState } from 'react'
import Notifications from './Notifications/Notifications'
import Chat from '../SideBar/Chat/Chat'

import { connect } from 'react-redux';
import FriendsList from './FriendsList/FriendsList';
import Overview from './Overview/Overview';
import styles from './Sidebar.module.css'

const SideBar = (props) => {
  const { sideBar } = props
  const [chatWith, setChatWith] = useState({})

  return (
    <div className={styles.sidebar} id="side-bar">
      {sideBar === 'overview' ?
        <Overview /> :
        sideBar === 'friends' ?
          <FriendsList setChatWith={setChatWith}/> :
          sideBar === 'groups' ?
            <h2>groups</h2> :
            sideBar === 'chats' ?
              <Chat friend={chatWith} /> :
              sideBar === 'notifications' ?
                <Notifications /> :
                sideBar === 'account' ?
                  <h2>account</h2> : null
      }

    </div>
  )
}

interface stateInt {
  sideBar: string
}

export default connect((state: stateInt) => ({ sideBar: state.sideBar }), {})(SideBar);
