import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth
} from './utils/firebase/firebase';
import './App.scss';
import { selectUser, setUser } from './redux/slices/userSlice';
import { Route, Routes } from 'react-router-dom';
import { NAVIGATION_PATHS } from './exports/contants';
import Navigation from './components/navigation/navigation';
import Home from './routes/home/home';
import { ProtectedNoUserRoute } from './routes/protected/protected';
import SignIn from './routes/sign-in/sign-in';
import SignUp from './routes/sign-up/sign-up';
import {
  getMessages,
  getMessageThreadsForUser,
  getUsersForMessageThreads
} from './utils/firebase/firebase-getters';
import {
  selectMessageThreads,
  setMessages,
  setMessageThreads,
  setUsersInfo
} from './redux/slices/messagesSlice';
import { removeItemFromArray } from './exports/functions';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const messageThreads = useSelector(selectMessageThreads);

  // Listens for the user to sign in or out
  useEffect(() => {
    onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
        dispatch(setUser(user));
        sessionStorage.setItem('Auth Token', user.refreshToken);
      } else {
        sessionStorage.removeItem('Auth Token');
      }
    });
  }, [dispatch]);

  // Get all objects in the message threads for user database table
  useEffect(() => {
    if (user) {
      getMessageThreadsForUser(user.uid).then((res) => {
        dispatch(setMessageThreads(res));
      });
    }
    // eslint-disable-next-line
  }, [user]);

  // Once user is available, get all user information for each message thread
  // the user is a part of.
  useEffect(() => {
    if (user && messageThreads.length > 0) {
      let threadUsers = messageThreads.reduce(
        (prev, cur) => prev.concat(cur.users),
        []
      );
      threadUsers = removeItemFromArray(threadUsers, user.uid);

      getUsersForMessageThreads(threadUsers).then((res) => {
        dispatch(setUsersInfo(res));
      });
    }
    // eslint-disable-next-line
  }, [user, messageThreads]);

  // Get all messages for all message threads the user is a part of
  useEffect(() => {
    if (user && messageThreads.length > 0) {
      getMessages().then((res) => dispatch(setMessages(res)));
    }
    // eslint-disable-next-line
  }, [user, messageThreads]);

  return (
    <Routes>
      <Route path={NAVIGATION_PATHS.home} element={<Navigation />}>
        <Route index element={<Home />} />
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
