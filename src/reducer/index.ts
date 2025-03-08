import { combineReducers } from 'redux';
import routersData from './routerModels';
import userinfo from './userModels';

const rootReducer = combineReducers({
  userinfo,
  routersData,
});

const whitelist = ['userinfo'];

export { rootReducer, whitelist };
