import React from 'react';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';

export const titleConfig = [
  {
    id: 'createSys',
    title: '创建系统',
  },
  {
    id: 'editSys',
    title: '编辑系统',
  },
  {
    id: 'createMenu',
    title: '创建菜单',
  },
  {
    id: 'editMenu',
    title: '编辑菜单',
  },
];

export interface ISMenuDetail {
  children?: ISMenuDetail[] | undefined;
  id: string;
  key: string;
  title: string;
  code: string;
  path: string;
  type: string;
  icon?: React.ReactNode;
  sortOrder: number;
  description?: string | undefined;
  remark?: string | undefined;
  parentId?: string | undefined;
}

export const convertToMenuItems = (data: ISMenuDetail[]): ISMenuDetail[] => {
  return data.map((item) => ({
    ...item,
    icon:
      !item.children || item.children.length === 0
        ? React.createElement(FileOutlined)
        : React.createElement(FolderOutlined),
    children: item.children?.length ? convertToMenuItems(item.children) : undefined,
  }));
};
