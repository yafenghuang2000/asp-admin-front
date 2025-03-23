import { post, get } from '@/utils/request';
import { ISMenusResponse, IScreateMensItems } from './type.ts';

export const login = (): Promise<unknown> => {
  return post({ url: '/login', data: { username: 'admin', password: '123456' } });
};

/**
 * 新增菜单
 */

export const addMenu = (data: IScreateMensItems): Promise<string> =>
  post({ url: '/menu/create', data }) as unknown as Promise<string>;

/**
 * 查询菜单列表
 */
export const getMenuList = (): Promise<ISMenusResponse[]> => get({ url: '/menu/queryAll' });
