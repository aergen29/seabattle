import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  room: "",
};

const informationsSlice = createSlice({
  name: "informationsSlice",
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state = { ...current(state) };
      const { name, value } = payload;
      state[name] = value;
      return state;
    },
    reset: () => {
      return initialState;
    },
  },
});
export const { set, reset } = informationsSlice.actions;
export default informationsSlice.reducer;
