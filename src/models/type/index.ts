import { IRouterResponse } from './routerModelsType.ts';
import { ISuserinfoprops } from './userModelsType.ts';

export interface IStoreProps {
  userinfo: ISuserinfoprops;
  routersData: {
    routerList: Array<IRouterResponse>;
  };
}
