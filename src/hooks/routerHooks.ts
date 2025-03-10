import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 路由跳转带参数的，参数不显示在URL地址栏
 * @param path
 * @param params
 * @returns
 */
export const useNavigateWithParams = <T>(path: string, params: T): (() => void) => {
  const navigate = useNavigate();
  return () => navigate(path, { state: params });
};

/**
 *
 * 路由跳转带参数的，参数显示在URL地址栏
 * @param path
 * @param params
 * @returns
 */
export const useNavigateWithQuery = <T>(path: string, params: T): (() => void) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(params as Record<string, string>);
  return () => navigate(`${path}?${searchParams.toString()}`);
};

/**
 * 获取URL地址栏参数并转成json对象
 * @returns
 */
export const useQuery = (): Record<string, string> => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
};

/**
 * 获取路由跳转时传递的参数(state参数)
 * @returns
 */
export const useSearchParams = <T>(): T => {
  const location = useLocation();
  return location.state as T;
};

/**
 * 返回上一页
 */
export const useGoBack = (): (() => void) => {
  const navigate = useNavigate();
  return () => navigate(-1);
};

/**
 * 返回首页
 */

export const useGoHome = (): (() => void) => {
  const navigate = useNavigate();
  return () => navigate('/');
};

/**
 * 返回登陆页面
 */

export const useGoLogin = (): (() => void) => {
  const navigate = useNavigate();
  return () => navigate('/login');
};
