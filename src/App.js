import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  firestore
} from './utils/firebase/firebase';
import './App.scss';
import './App.mobile.scss';
import { selectUser, setPhotoURL, setUser } from './redux/slices/userSlice';
import { Route, Routes } from 'react-router-dom';
import { NAVIGATION_PATHS } from './exports/contants';
import Navigation from './components/navigation/navigation';
import Home from './routes/home/home';
import {
  ProtectedNoUserRoute,
  ProtectedUserRoute
} from './routes/protected/protected';
import SignIn from './routes/sign-in/sign-in';
import SignUp from './routes/sign-up/sign-up';
import {
  getMessages,
  getMessageThreadsForUser
} from './utils/firebase/firebase-getters';
import {
  selectMessageThreads,
  setLoading,
  setMessages,
  setMessageThreads,
  setUsersInfo
} from './redux/slices/messagesSlice';
import {
  listenForUserInactive,
  stopListeningForUserInactive
} from './exports/functions';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { userConverter } from './classes/User';
import { editUserOnline } from './utils/firebase/firebase-modifiers';

function App() {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const messageThreads = useSelector(selectMessageThreads);

  const [showSideMenu, setShowSideMenu] = useState(false);

  // Listens for the user to sign in or out
  useEffect(() => {
    onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user, {
          online: true,
          photo_url: user.photoURL ? user.photoURL : '',
          uid: user.uid
        }).then((res) => {
          if (res.type === 'get') editUserOnline(user.uid, true);
        });

        dispatch(setUser(user));
        sessionStorage.setItem('Auth Token', user.refreshToken);
      } else {
        sessionStorage.removeItem('Auth Token');
      }
    });
    //eslint-disable-next-line
  }, [dispatch]);

  // Get all objects in the message threads for user database table
  useEffect(() => {
    if (currentUser) {
      dispatch(setLoading(true));

      getMessageThreadsForUser(currentUser.uid).then((res) => {
        dispatch(setMessageThreads(res));

        if (res.length === 0) dispatch(setLoading(false));
      });
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // Once user is available, get all user information for each message thread
  // the user is a part of and listen for updates to their user information,
  // like if they are online or their photo changes.
  useEffect(() => {
    if (currentUser) {
      dispatch(setLoading(true));

      // let threadUsers = messageThreads.reduce(
      //   (prev, cur) => prev.concat(cur.users),
      //   []
      // );
      // threadUsers = removeItemFromArray(threadUsers, currentUser.uid);

      const q = query(
        collection(firestore, 'users').withConverter(userConverter)
        // where('uid', 'in', threadUsers)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersList = [];

        querySnapshot.forEach((doc) => {
          usersList.push(doc.data());
        });

        // Set current user's photo URL if it has changed
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'modified' && change.doc.id === currentUser.uid) {
            dispatch(setPhotoURL(change.doc.data().photo_url));
          }
        });

        dispatch(setUsersInfo(usersList));
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // Get all messages for all message threads the user is a part of
  useEffect(() => {
    if (currentUser && messageThreads.length > 0) {
      dispatch(setLoading(true));

      getMessages().then((res) => dispatch(setMessages(res)));
    }
    // eslint-disable-next-line
  }, [currentUser, messageThreads]);

  // Set the user offline when they are inactive for 30 seconds, or set them
  // online when they become active again.
  useEffect(() => {
    if (currentUser) {
      listenForUserInactive(currentUser.uid);
    } else {
      stopListeningForUserInactive();
    }
  }, [currentUser]);

  return (
    <Routes>
      <Route
        path={NAVIGATION_PATHS.home}
        element={
          <Navigation
            showSideMenu={showSideMenu}
            setShowSideMenu={setShowSideMenu}
          />
        }
      >
        <Route
          index
          element={
            <ProtectedUserRoute redirectPath={NAVIGATION_PATHS.sign_in}>
              <Home />
            </ProtectedUserRoute>
          }
        />
        <Route
          path={NAVIGATION_PATHS.sign_in}
          element={
            <ProtectedNoUserRoute>
              <SignIn />
            </ProtectedNoUserRoute>
          }
        />
        <Route path={NAVIGATION_PATHS.sign_up} element={<SignUp />} />
        <Route path="*" element={<div>Empty</div>} />
      </Route>
    </Routes>
  );
}

export default App;
