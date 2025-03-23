export interface IMenuItem {
  id: string;
  key: string;
  title: string;
  label: string;
  code: string;
  path: string;
  icon?: React.ReactNode | null;
  sortOrder: number;
  children?: Array<IMenuItem> | undefined;
}

export const convertToMenuItems = (data: IMenuItem[]): IMenuItem[] => {
  return data.map((item) => {
    return {
      id: item.id,
      key: item.key,
      label: item?.title,
      title: item?.title,
      code: item.code,
      path: item.path,
      icon: item.icon,
      sortOrder: item.sortOrder,
      children:
        item.children && item.children.length > 0 ? convertToMenuItems(item.children) : undefined,
    };
  });
};
