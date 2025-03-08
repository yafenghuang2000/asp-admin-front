import { MockMethod } from 'vite-plugin-mock';

interface IUserResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    age: number;
  };
}

interface IRouterResponse {
  code: number;
  message: string;
  data: Array<{
    id: string;
    label: string;
    path?: string;
    children?: Array<{
      id: string;
      label: string;
      path: string;
    }>;
  }>;
}

const userMock: MockMethod[] = [
  {
    url: '/user',
    method: 'get',
    response: (): IUserResponse => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: 1,
          name: 'John Doe',
          age: 30,
        },
      };
    },
  },
  {
    url: '/router',
    method: 'post',
    response: (): IRouterResponse => {
      return {
        code: 0,
        message: 'success',
        data: [
          {
            id: '1',
            label: '首页',
            path: '/',
          },
          {
            id: '2',
            label: '工单管理',
            children: [
              {
                id: '2-1',
                label: '新建工单',
                path: '/tickets/create',
              },
              {
                id: '2-2',
                label: '工单列表',
                path: '/tickets/list',
              },
            ],
          },
          {
            id: '3',
            label: '客户管理',
            children: [
              {
                id: '3-1',
                label: '客户列表',
                path: '/customers',
              },
              {
                id: '3-2',
                label: '服务记录',
                path: '/service-records',
              },
            ],
          },
        ],
      };
    },
  },
];

export default userMock;
