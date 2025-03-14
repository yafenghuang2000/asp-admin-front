export interface IMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: IMenuItem[];
}

export interface IRouterResponse {
  // 根据实际情况定义字段
  id: string;
  label: string;
  path?: string;
  children?: IRouterResponse[];
}
