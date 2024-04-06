import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slice/userSlice.js';
import groupReducer from './Slice/groupSlice.js';
import roomReducer from './Slice/roomSlice.js';
import dataReducer from './Slice/dataSlice.js'
const store = configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer,
    room: roomReducer,
    data: dataReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false, 
      actionCreatorCheck: true,
    }),
});


export default store;
