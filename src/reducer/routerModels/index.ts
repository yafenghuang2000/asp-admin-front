import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { getMenuList } from '@/service/userService';
import TrackingService from '@/utils/trackingService';
import { convertToMenuItems } from '@/utils/treeFunction.ts';

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

export const getMenuAll = (): unknown => async (dispatch: Dispatch) => {
  try {
    const getMenuListRes = await getMenuList();
    dispatch(setMenuData(convertToMenuItems(getMenuListRes || [])));
  } catch (error) {
    await TrackingService.trackEvent('getMenuData', { error: JSON.stringify(error) });
  }
};

export default routersSlice.reducer;
