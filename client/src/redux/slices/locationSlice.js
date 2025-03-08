import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  values: [],
};

const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducer: {
    add:(state,{payload})=>{
      state = current(state);
      const {index,location,length} = payload;
      const values = state.values;
      const value = values.filter(e=>e.index === index)[0];
      if(value) value = {...value, location,length};
      else values.push({index,location,length});
      return {...state,values};
    },
    remove:(state,{payload})=>{
      state = current(state);
      const index = payload;
      const values = state.values;
      values = values.filter(e=>e.index !== index)[0];
      return {...state,values}
    }
  },
});

export const { add, remove } = informationsSlice.actions;
export default locationSlice.reducer;
