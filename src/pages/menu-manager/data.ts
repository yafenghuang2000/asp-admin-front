export const createMenu = (): Array<{ id: number; title: string }> => {
  const list = [];
  for (let i = 0; i < 40; i++) {
    list.push({ id: i + 1, title: `菜单名称${i + 1}` });
  }
  return list;
};
