import {configureStore} from '@reduxjs/toolkit';
import informationsSlice from './slices/informationsSlice';

export default configureStore({
  reducer:{
    informations:informationsSlice
  }
});