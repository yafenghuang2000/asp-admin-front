import { post, get } from '@/utils/request';
import { ISMenusResponse, IScreateMensItems } from './type.ts';

/**
 * 新增菜单
 */

export const addMenu = (data: IScreateMensItems): Promise<string> =>
  post({ url: '/menu/create', data }) as Promise<string>;

/**
 * 查询菜单列表
 */
export const getMenuList = (): Promise<ISMenusResponse[]> => get({ url: '/menu/queryAll' });
