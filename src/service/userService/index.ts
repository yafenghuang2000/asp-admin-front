import { post, get } from '@/utils/request';
import { ISMenusResponse, ICreateMensItems, IRegisterUser, ILoginUser, IUserInfo } from './type.ts';

/**
 * 新增用户
 */

export const register = (data: IRegisterUser): Promise<string> =>
  post({ url: '/user/register', data });

/**
 *登陆
 */

export const login = (data: ILoginUser): Promise<IUserInfo> => post({ url: '/user/login', data });

/**
 * 新增菜单
 */

export const addMenu = (data: ICreateMensItems): Promise<string> =>
  post({ url: '/menu/create', data });

/**
 * 查询菜单列表
 */
export const getMenuList = (): Promise<ISMenusResponse[]> => get({ url: '/menu/queryAll' });
