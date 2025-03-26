import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  isInRoom: false,
  room: "",
  opponent: "",
  myGrids: [],
  opponentGrids: [],
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state = { ...current(state) };
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
    shoot: (state, { payload }) => {
      state = { ...current(state) };
      let myGrids = [...state.myGrids];
      let opponentGrids = [...state.opponentGrids];
      const { x, y, who, status } = payload;
      if (who === true) {
        myGrids.push({ x, y, status });
      } else {
        opponentGrids.push({ x, y, status });
      }
      return {...state,myGrids,opponentGrids};
    },
    shootReset:(state)=>{
      state = {...current(state)};
      return {...state,opponentGrids:[],myGrids:[]};
    }
  },
});

export const { set, reset, shoot,shootReset } = gameSlice.actions;
export default gameSlice.reducer;
