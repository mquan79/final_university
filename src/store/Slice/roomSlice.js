import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    room: null,
    conference: false,
    inConference: false,
    call: false,
    inCall: false,
    device: {
      audio: false,
      video: true
    },
    roomCall: null
  },
  reducers: {
    setRoom: (state, action) => {
        state.room = action.payload;
    },

    removeRoom: (state) => {
        state.room = null;
    },

    onConference: (state) => {
      state.conference = true;
    },

    offConference: (state) => {
      state.conference = false;
    },

    inConference: (state) => {
      state.inConference = true
    },

    outConference: (state) => {
      state.inConference = false
    },

    onCall: (state) => {
      state.call = true;
    },

    offCall: (state) => {
      state.call = false;
    },

    inCall: (state) => {
      state.inCall = true
    },

    outCall: (state) => {
      state.inCoutCall = false
    },

    setDevice: (state, action) => {
      state.device = action.payload;
    },

    setRoomCall: (state, action) => {
      state.roomCall = action.payload
    }
  },
});

export const { setRoom, removeRoom, onConference, offConference, inConference, outConference, onCall, offCall, inCall, outCall, setDevice, setRoomCall } = roomSlice.actions;
export default roomSlice.reducer;
