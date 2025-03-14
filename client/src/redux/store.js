import {configureStore} from '@reduxjs/toolkit';
import informationsSlice from './slices/informationsSlice';
import locationSlice from './slices/locationSlice';

export default configureStore({
  reducer:{
    informations:informationsSlice,
    locations:locationSlice
  }
});