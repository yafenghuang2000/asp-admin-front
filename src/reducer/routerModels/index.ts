import { createSlice } from '@reduxjs/toolkit';
import { list } from './data.ts';

const routersSlice = createSlice({
  name: 'xms/router',
  initialState: {
    routerList: list ?? [],
  },
  reducers: {},
});

export const {} = routersSlice.actions;
export default routersSlice.reducer;
