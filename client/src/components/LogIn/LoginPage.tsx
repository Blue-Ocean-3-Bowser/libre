import React from 'react';
import { connect } from 'react-redux';
import GoogleButton from 'react-google-button';
import { authentication, db } from '../../../../configs/config';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { signin } from '../../redux/actions/currUser';
import styles from './LoginPage.module.css';
import Canvas from './Canvas';

import productImg from '../../../public/product-image.png';

const LoginPage = (props) => {
  const { currUser, signin } = props;

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    provider.addScope('https://www.googleapis.com/auth/calendar');
    provider.addScope('https://www.googleapis.com/auth/calendar.settings.readonly');
    provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
    provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
    signInWithPopup(authentication, provider)
    .then((res: any) => {
      const { displayName, email, photoUrl, oauthAccessToken, oauthIdToken, refreshToken } = res._tokenResponse;

      // save user information into database
      getDoc(doc(db, "users", email))
      .then((userData: any) => {
          console.log('USER DATA', userData.data())
          const friends = userData.data() === undefined ? [] : userData.data().friends;
          const friendGroups = userData.data() === undefined ? [] : userData.data().friendGroups;
          const events = userData.data() === undefined ? [] : userData.data().events;
          setDoc(doc(db, "users", email), {
            displayName: displayName,
            email: email,
            photoUrl: photoUrl,
            oauthIdToken: oauthIdToken,
            oauthAccessToken: oauthAccessToken,
            refreshToken: refreshToken,
            friends: friends,
            friendGroups: friendGroups,
            events: events
          })

          // set the redux state with user information
          signin({ displayName, email, photoUrl, oauthAccessToken, refreshToken, friends, friendGroups, events});
        })
    })
    .catch(err => {
      console.log('error signing in: ', err)
    })
  }

  //ANIMATION CODE


  return (
    <>
      <Canvas />
      <div id="login-page" className={styles.login}>
        <div className={styles.main} >
          <h1 className={styles.h1}>LIBRE</h1>
          <h3 className={styles.h3}>A NEW WAY TO SHARE FREE TIME WITH FRIENDS.</h3>
          <GoogleButton className={styles.button} onClick={signInWithGoogle}/>
        </div>
        <div className={styles.product}>
          <div className={styles.card}>
            <img src={productImg} />
          </div>
        </div>
      </div>
    </>
  )
}

// map state
function mapStatetoProps(state) {
  const { currUser } = state;
  return { currUser };
};

// map methods to update the state
const mapDispatchToProps =  { signin };


// export default LoginPage;
export default connect(mapStatetoProps, mapDispatchToProps)(LoginPage);