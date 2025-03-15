import React from 'react';

export interface IRouterResponse {
  // 根据实际情况定义字段
  id: string;
  label: string;
  path?: string;
  children?: IRouterResponse[];
}

export interface IMenuItem {
  key: string;
  id: string;
  title?: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: IMenuItem[];
}
export const convertToMenuItems = (items: IRouterResponse[]): IMenuItem[] =>
  items.map((item) => ({
    id: item.id,
    key: item.id,
    // key: item.id || `key-${item.id}`,
    title: item.label,
    label: item.label,
    path: item.path,
    children: item.children?.length ? convertToMenuItems(item.children) : undefined,
  }));
