import { post } from '@/utils/request';

export const login = (): Promise<unknown> => {
  return post({ url: '/login', data: { username: 'admin', password: '123456' } });
};
