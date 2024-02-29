import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mailReducer from './mailSlice';
import sentReducer from './sentSlice'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    sent: sentReducer,
  },
});

export default store;