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
  getMessageThreadsForUser,
  getMessageThreadUsersForMessageThreads,
  getUsersForMessageThreads
} from './utils/firebase/firebase-getters';
import {
  selectMessageThreads,
  selectMessageThreadUsers,
  setMessageThreads,
  setMessageThreadUsers,
  setUsers
} from './redux/slices/messagesSlice';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const messageThreads = useSelector(selectMessageThreads);
  const messageThreadUsers = useSelector(selectMessageThreadUsers);

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

  // Once user is available, get all message threads for user
  useEffect(() => {
    if (user) {
      getMessageThreadsForUser(user.uid).then((res) =>
        dispatch(setMessageThreads(res))
      );
    }
  }, [user, dispatch]);

  // Once user is available, get all message thread user
  useEffect(() => {
    if (user && messageThreads.length > 0) {
      getMessageThreadUsersForMessageThreads(user.uid, messageThreads).then(
        (res) => dispatch(setMessageThreadUsers(res))
      );
    }
  }, [user, messageThreads, dispatch]);

  // Once user is available, get all user information for each message thread
  // the user is a part of.
  useEffect(() => {
    if (user && messageThreadUsers.length > 0) {
      const threadUsers = messageThreadUsers.reduce(
        (prev, cur) => prev.concat(cur.users),
        []
      );

      getUsersForMessageThreads(threadUsers).then((res) =>
        dispatch(setUsers(res))
      );
    }
  }, [user, messageThreadUsers, dispatch]);

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
