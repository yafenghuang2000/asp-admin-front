export const list = [
  {
    id: '1',
    label: '首页',
    path: '/',
  },
  {
    id: '2',
    label: '系统配置',
    children: [
      {
        id: '2-1',
        label: '系统管理',
        children: [
          {
            id: '2-1-1',
            label: '数据字典',
            path: '/systemManagement/dataDict',
          },
          {
            id: '2-1-2',
            label: '接口日志',
            path: '/systemManagement/apiLogs',
          },
        ],
      },
      {
        id: '2-2',
        label: '账号权限',
        children: [
          {
            id: '2-2-1',
            label: '角色管理',
            path: '/authMenu/roleAdmin',
          },
          {
            id: '2-2-2',
            label: '菜单管理',
            path: '/authMenu/menuList',
          },
          {
            id: '2-2-3',
            label: '用户管理',
            path: '/authMenu/userAdmin',
          },
          {
            id: '2-2-4',
            label: '权限列表',
            path: '/authMenu/authList',
          },
        ],
      },
    ],
  },
];
