import React from 'react';

export interface IRouterResponse {
  // 根据实际情况定义字段
  id: string;
  label: string;
  path?: string;
  sortOrder?: number;
  children?: IRouterResponse[];
}

export interface IMenuItem {
  key: string;
  id: string;
  title?: string;
  remark?: string | null;
  code?: string | null;
  label: string;
  icon?: React.ReactNode | null;
  path?: string;
  children?: IMenuItem[];
  sortOrder?: number;
}
export const convertToMenuItems = (items: Array<IRouterResponse>): IMenuItem[] =>
  items.map((item) => ({
    id: item.id,
    key: item.id,
    title: item.label,
    label: item.label,
    sortOrder: item.sortOrder || 0,
    path: item.path,
    children: item.children?.length ? convertToMenuItems(item.children) : undefined,
  }));
