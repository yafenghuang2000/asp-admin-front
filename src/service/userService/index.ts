import { post, get } from '@/utils/request';

export const login = (): Promise<unknown> => {
  return post({ url: '/login', data: { username: 'admin', password: '123456' } });
};

/**
 * 新增菜单
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const addMenu = (data: any): Promise<any> => post({ url: '/api/menu/create', data });

/**
 * 查询菜单列表
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMenuList = (): Promise<any> => get({ url: '/api/menu/queryAll' });
