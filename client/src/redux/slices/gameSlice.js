import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  isInRoom: false,
  room: "",
  opponent:""
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state = {...current(state)};
      const { name, value } = payload;
      if (typeof name == "object") {
        for (let i = 0; i < name.length; i++) {
          state[name[i]] = value[i];
        }
      } else state[name] = value;
      return state;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const { set, reset } = gameSlice.actions;
export default gameSlice.reducer;
