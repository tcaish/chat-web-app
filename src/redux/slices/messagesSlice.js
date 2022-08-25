import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersInfo: [],
  messageThreads: [],
  messages: [],
  selectedMessageThread: null
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setUsersInfo: (state, action) => {
      state.usersInfo = action.payload;
    },
    setMessageThreads: (state, action) => {
      state.messageThreads = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedMessageThread: (state, action) => {
      state.selectedMessageThread = action.payload;
    }
  }
});

// Setters
export const {
  setUsersInfo,
  setMessageThreads,
  setMessages,
  setSelectedMessageThread
} = messagesSlice.actions;

// Selectors
export const selectUsersInfo = (state) => state.messages.usersInfo;
export const selectMessageThreads = (state) => state.messages.messageThreads;
export const selectMessages = (state) => state.messages.messages;
export const selectSelectedMessageThread = (state) =>
  state.messages.selectedMessageThread;

export default messagesSlice.reducer;
