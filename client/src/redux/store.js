import { configureStore } from "@reduxjs/toolkit";
import informationsSlice from "./slices/informationsSlice";
import locationSlice from "./slices/locationSlice";
import gameSlice from "./slices/gameSlice";

export default configureStore({
  reducer: {
    informations: informationsSlice,
    locations: locationSlice,
    game: gameSlice,
  },
});
