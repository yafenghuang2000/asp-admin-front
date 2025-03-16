import React from 'react';

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

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
  id?: string;
  key: string;
  title: string;
  code: string;
  path: string;
  type: string;
  icon?: React.ReactNode | null;
  sortOrder: number;
  description?: string | null;
  remark?: string | null;
  children?: Array<ISMenuDetail> | undefined;
}

export const convertToMenuItems = (items: ISMenuDetail[]): ISMenuDetail[] => {
  return items.map((item) => {
    return {
      id: item.id,
      key: item.key,
      title: item.title,
      code: item.code,
      path: item.path,
      type: item.type,
      icon: item.icon,
      sortOrder: item.sortOrder,
      description: item.description,
      remark: item.remark,
      children: item.children?.length ? convertToMenuItems(item.children) : undefined,
    };
  });
};
