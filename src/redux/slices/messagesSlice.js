import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersInfo: [],
  messageThreads: [],
  messages: [],
  selectedMessageThread: null,
  selectedMessageListItem: null,
  selectedMessageUserOnline: false,
  selectedMessageUserTyping: ''
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
    },
    setSelectedMessageListItem: (state, action) => {
      // const display_name = action.payload.display_name
      //   ? action.payload.display_name
      //   : state.selectedMessageListItem.display_name;
      // const id = action.payload.id
      //   ? action.payload.id
      //   : state.selectedMessageListItem.id;
      // const last_message = action.payload.last_message
      //   ? action.payload.last_message
      //   : state.selectedMessageListItem.last_message;
      // const messages = action.payload.messages
      //   ? action.payload.messages
      //   : state.selectedMessageListItem.messages;
      // const online = action.payload.online
      //   ? action.payload.online
      //   : state.selectedMessageListItem.online;
      // const photo_url = action.payload.photo_url
      //   ? action.payload.photo_url
      //   : state.selectedMessageListItem.photo_url;
      // const user_uid = action.payload.user_uid
      //   ? action.payload.user_uid
      //   : state.selectedMessageListItem.user_uid;

      // state.selectedMessageListItem = {
      //   display_name,
      //   id,
      //   last_message,
      //   messages,
      //   online,
      //   photo_url,
      //   user_uid
      // };
      state.selectedMessageListItem = action.payload;
    },
    setSelectedMessageUserOnline: (state, action) => {
      state.selectedMessageUserOnline = action.payload;
    },
    setSelectedMessageUserTyping: (state, action) => {
      state.selectedMessageUserTyping = action.payload;
    }
  }
});

// Setters
export const {
  setUsersInfo,
  setMessageThreads,
  setMessages,
  setSelectedMessageThread,
  setSelectedMessageListItem,
  setSelectedMessageUserOnline,
  setSelectedMessageUserTyping
} = messagesSlice.actions;

// Selectors
export const selectUsersInfo = (state) => state.messages.usersInfo;
export const selectMessageThreads = (state) => state.messages.messageThreads;
export const selectMessages = (state) => state.messages.messages;
export const selectSelectedMessageThread = (state) =>
  state.messages.selectedMessageThread;
export const selectSelectedMessageListItem = (state) =>
  state.messages.selectedMessageListItem;
export const selectSelectedMessageUserOnline = (state) =>
  state.messages.selectedMessageUserOnline;
export const selectSelectedMessageUserTyping = (state) =>
  state.messages.selectedMessageUserTyping;

export default messagesSlice.reducer;
