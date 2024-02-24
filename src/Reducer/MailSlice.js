import { createSlice } from '@reduxjs/toolkit';

const mailSlice = createSlice({
  name: 'mail',
  initialState: {
    receivedMails: [], 
  },
  reducers: {
    setReceivedMails: (state, action) => {
      state.receivedMails = action.payload;
    },
  },
});

export const { setReceivedMails } = mailSlice.actions;
export default mailSlice.reducer;