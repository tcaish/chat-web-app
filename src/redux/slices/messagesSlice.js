import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  messageThreads: [],
  messageThreadUsers: []
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setMessageThreads: (state, action) => {
      state.messageThreads = action.payload;
    },
    setMessageThreadUsers: (state, action) => {
      state.messageThreadUsers = action.payload;
    }
  }
});

// Setters
export const { setUsers, setMessageThreads, setMessageThreadUsers } =
  messagesSlice.actions;

// Selectors
export const selectUsers = (state) => state.messages.users;
export const selectMessageThreadUsers = (state) =>
  state.messages.messageThreadUsers;
export const selectMessageThreads = (state) => state.messages.messageThreads;

export default messagesSlice.reducer;
