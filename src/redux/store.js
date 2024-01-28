import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../redux/reducers/user';

export default configureStore({
  reducer: {
    user : userReducer
  },
})