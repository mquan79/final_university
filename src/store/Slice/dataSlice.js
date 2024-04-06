import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    user: null,
    group: null,
    topic: null,
    member: null,
    message: null,
    uploadImage: null,
    friend: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setTopic: (state, action) => {
      state.topic = action.payload;
    },
    setMember: (state, action) => {
      state.member = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setUploadImage: (state, action) => {
      state.uploadImage = action.payload;
    }, 
    setFriend: (state, action) => {
      state.friend = action.payload;
    }
  },
});

export const { 
  setUser,
  setGroup,
  setTopic,
  setMember,
  setMessage,
  setUploadImage, 
  setFriend
} = dataSlice.actions;
export default dataSlice.reducer;
