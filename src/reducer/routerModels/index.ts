import { createSlice } from '@reduxjs/toolkit';

const routersSlice = createSlice({
  name: 'xms/router',
  initialState: {
    routerList: [],
    status: 'idle', // 用于跟踪请求状态
  },
  reducers: {
    setMenuData: (state, actions) => {
      state.routerList = actions.payload;
    },
  },
});

export const { setMenuData } = routersSlice.actions;

export default routersSlice.reducer;
