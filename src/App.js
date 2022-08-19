import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth
} from './utils/firebase/firebase';
import './App.css';
import { selectUser, setUser } from './redux/slices/userSlice';
import { Route, Routes } from 'react-router-dom';
import { NAVIGATION_PATHS } from './exports/contants';
import Navigation from './components/navigation/navigation';
import Home from './routes/home/home';

function App() {
  const dispatch = useDispatch();

  // const user = useSelector(selectUser);

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

  return (
    <Routes>
      <Route path={NAVIGATION_PATHS.home} element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div>Empty</div>} />
      </Route>
    </Routes>
  );
}

export default App;
