import { createSlice } from '@reduxjs/toolkit';

const sentSlice = createSlice({
  name: 'sent',
  initialState: {
    sentMails: [],
  },
  reducers: {
    setSentMails: (state, action) => {
      state.sentMails = action.payload;
    },
  },
});

export const { setSentMails } = sentSlice.actions;
export default sentSlice.reducer;