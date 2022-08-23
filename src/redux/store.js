import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import messagesReducer from './slices/messagesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
