import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import messagesReducer from './slices/messagesSlice';
import screenReducer from './slices/screenSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer,
    screen: screenReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
