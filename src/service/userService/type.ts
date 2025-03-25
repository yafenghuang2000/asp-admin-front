//菜单列表
export interface ISMenusResponse {
  children: ISMenusResponse[] | undefined;
  id: string;
  key: string;
  title: string;
  code: string;
  path: string;
  type: string;
  icon?: string | undefined;
  sortOrder: number;
  description?: string | undefined;
  remark?: string | undefined;
  parentId?: string | undefined;
}

//新增菜单项
export interface ICreateMensItems {
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

//注册用户
export interface IRegisterUser {
  username: string;
  nickname: string; //姓名
  email: string;
  phone: string;
  type: string;
  organization?: string; //所属组织
  role?: string[]; //权限
  status: string;
}
