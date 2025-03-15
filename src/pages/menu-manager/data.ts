export const createMenu = (): Array<{ id: number; title: string }> => {
  const list = [];
  for (let i = 0; i < 20; i++) {
    list.push({ id: i + 1, title: `菜单名称${i + 1}` });
  }
  return list;
};

export interface ISOnSelectNodeProps {
  id: string;
  key: string;
  title: string;
  path: string;
  children?: Array<ISMenuDetail> | null;
}

export interface ISMenuDetail {
  key: string;
  title: string;
  path?: string;
  code: string | null;
  type: string | null;
  icon: string | null;
  sort: string | number | null;
  remark: string | null;
}
