//菜单列表
export interface ISMenusResponse {
  id: string;
  title: string;
  code: string;
  path: string;
  type: string;
  icon?: string;
  sortOrder: number;
  description?: string;
  remark?: string;
  children?: Array<ISMenusResponse>;
  parentId?: string;
}

//新增菜单项
export interface IScreateMensItems {
  id?: string;
  title: string;
  code: string;
  path: string;
  type: string;
  icon?: string;
  sortOrder?: number;
  description: string;
  remark: string;
  parentId?: string;
}
