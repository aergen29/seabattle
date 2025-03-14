import { createSlice, current } from "@reduxjs/toolkit";
import { filledSet } from "../../helper/valueControls";

const initialState = {
  gridSize: 8,
  values: [],
  filled: [],
};

const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducers: {
    setGridSize: (state, { payload }) => {
      state = { ...current(state) };
      return { ...state, gridSize: payload };
    },
    add: (state, { payload }) => {
      state = current(state);
      const { index, location, length, isHorizontal } = payload;
      const values = [...state.values];
      let ind = values.findIndex((e) => e.index === index);
      if (ind !== -1) {
        values[ind] = { ...values[ind], location, length, isHorizontal };
      } else values.push({ index, location, length, isHorizontal });
      let filled = filledSet(state.filled, payload, state.gridSize);
      return { ...state, values, filled };
    },
    remove: (state, { payload }) => {
      state = current(state);
      const index = payload;
      let values = state.values;
      let ship = values.find((e) => e.index === index);
      values = values.filter((e) => e.index !== index);
      values = values ? values : [];
      let filled = state.filled;
      if(ship) filled = filledSet(state.filled, ship, state.gridSize,false);
      return { ...state, values, filled };
    },
  },
});

export const { add, remove, setGridSize } = locationSlice.actions;
export default locationSlice.reducer;
