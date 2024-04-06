import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    group: null,
    topic: null
  },
  reducers: {
    setGroup: (state, action) => {
        state.group = action.payload;
    },

    removeGroup: (state) => {
        state.group = null;
    },

    setTopic: (state, action) => {
        state.topic = action.payload;
    },

    removeTopic: (state) => {
      state.topic = null
    }
  },
});

export const { setGroup, removeGroup, setTopic, removeTopic } = groupSlice.actions;
export default groupSlice.reducer;
