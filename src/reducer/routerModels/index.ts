import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { getMenuList } from '@/service/userService';
import TrackingService from '@/utils/trackingService';
import { IRouterResponse, IMenuItem } from './type';

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

export const convertToMenuItems = (items: IRouterResponse[]): IMenuItem[] =>
  items.map((item) => {
    return {
      id: item.id,
      label: item.label,
      path: item.path,
      children:
        item.children && item.children.length > 0 ? convertToMenuItems(item.children) : undefined,
    };
  });

export const getMenuAll = (): unknown => async (dispatch: Dispatch) => {
  try {
    const getMenuListRes = await getMenuList();
    dispatch(setMenuData(convertToMenuItems(getMenuListRes || [])));
  } catch (error) {
    TrackingService.trackEvent('getMenuData', { error: JSON.stringify(error) });
  }
};

export default routersSlice.reducer;
