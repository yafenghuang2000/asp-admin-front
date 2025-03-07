import React from 'react';
export interface IMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: IMenuItem[];
}

export interface IUserinfoResponse {
  id: number;
  name: string;
  age: number;
}

export interface IUuserParams {
  username?: string;
}

export interface IRouterResponse {
  // 根据实际情况定义字段
  id: string;
  label: string;
  path?: string;
  children?: IRouterResponse[];
}

export const convertToMenuItems = (items: IRouterResponse[]): IMenuItem[] =>
  items.map((item) => {
    return {
      id: item.id,
      label: item.label,
      path: item.path,
      children: item.children ? convertToMenuItems(item.children) : undefined,
    };
  });
