import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  firestore
} from './utils/firebase/firebase';
import './App.scss';
import { selectUser, setUser } from './redux/slices/userSlice';
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
  setMessages,
  setMessageThreads,
  setUsersInfo
} from './redux/slices/messagesSlice';
import {
  listenForUserInactive,
  removeItemFromArray,
  stopListeningForUserInactive
} from './exports/functions';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { userConverter } from './classes/User';
import { editUserOnline } from './utils/firebase/firebase-modifiers';

function App() {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const messageThreads = useSelector(selectMessageThreads);

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
      getMessageThreadsForUser(currentUser.uid).then((res) => {
        dispatch(setMessageThreads(res));
      });
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // Once user is available, get all user information for each message thread
  // the user is a part of and listen for updates to their user information,
  // like if they are online or their photo changes.
  useEffect(() => {
    if (currentUser && messageThreads.length > 0) {
      let threadUsers = messageThreads.reduce(
        (prev, cur) => prev.concat(cur.users),
        []
      );
      threadUsers = removeItemFromArray(threadUsers, currentUser.uid);

      const q = query(
        collection(firestore, 'users').withConverter(userConverter),
        where('uid', 'in', threadUsers)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersList = [];

        querySnapshot.forEach((doc) => {
          usersList.push(doc.data());
        });

        dispatch(setUsersInfo(usersList));
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line
  }, [currentUser, messageThreads]);

  // Get all messages for all message threads the user is a part of
  useEffect(() => {
    if (currentUser && messageThreads.length > 0) {
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
      <Route path={NAVIGATION_PATHS.home} element={<Navigation />}>
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
