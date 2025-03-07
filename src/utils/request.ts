import request, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';
import { getCookie } from './cookies';
type ParamValue = string | number | null | undefined | boolean | Date;
interface IParamsType {
  [key: string]: ParamValue | ParamValue[];
}

interface ISAxiosResponse {
  handleRaw?: boolean;
}

interface IResponseConfig<T> {
  url: string;
  data?: T;
  params?: ISAxiosResponse;
}

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw new Error(error);
  },
);

const getQueryString = (params: IParamsType): string => {
  if (!params) return '';
  const result: string[] = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      result.push(`${key}=${encodeURIComponent(value.join(','))}`);
    } else {
      result.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  });
  return result.join('&');
};

const parse = (res: AxiosResponse, params: ISAxiosResponse) => {
  const { status, data } = res;
  const { handleRaw } = params;
  switch (status) {
    case 200:
      if (handleRaw) {
        return res.data;
      }
      if (data.code === 0) {
        return res.data.data;
      } else if (data.code === 401) {
        notification.open({
          type: 'warning',
          message: '提示',
          description: '登陆超时,请你重新登陆',
          placement: 'bottomRight',
          duration: 5000,
        });
        window.location.reload();
        return;
      } else {
        notification.open({
          type: 'error',
          message: '提示',
          description: data.message || '系统异常',
          placement: 'bottomRight',
          duration: 5000,
        });
      }
      break;
    case 401:
      notification.open({
        type: 'warning',
        message: '提示',
        description: '登陆超时,请你重新登陆',
        placement: 'bottomRight',
        duration: 5000,
      });
      window.location.reload();
      break;
    default:
      notification.open({
        type: 'error',
        message: '提示',
        description: data.message || '系统异常',
        placement: 'bottomRight',
        duration: 5000,
      });
      return;
  }
};

const get = async <T>(params: IResponseConfig<T>): Promise<T> => {
  try {
    const queryValues = getQueryString(params.data || {});
    const result: AxiosResponse = await request.get(
      queryValues ? `${params.url}?${queryValues}` : params.url,
    );
    return parse(result, params.params || {});
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const post = async <T>(params: IResponseConfig<T>): Promise<T> => {
  try {
    const result: AxiosResponse = await request.post(params.url, params.data);
    return parse(result, params.params || {});
  } catch (error) {
    console.log(error, '请求错误', {});
    return Promise.reject(error);
  }
};

const put = async <T>(params: IResponseConfig<T>): Promise<T> => {
  try {
    const result: AxiosResponse = await request.put(params.url, params.data);
    return parse(result, params.params || {});
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const del = async <T>(params: IResponseConfig<T>): Promise<T> => {
  try {
    const result: AxiosResponse = await request.delete(params.url, { data: params.data });
    return parse(result, params.params || {});
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

/**
 * 上传文件
 */
const uploadFile = async <T>(params: IResponseConfig<T>): Promise<T> => {
  try {
    const formData = new FormData();
    if (Array.isArray(params.data)) {
      params.data.forEach((file) => {
        if (file instanceof Blob || file instanceof File) {
          formData.append('files', file); // 使用 'files' 作为字段名以支持多个文件
        }
      });
    } else if (params.data instanceof Blob || params.data instanceof File) {
      formData.append('file', params.data);
    }

    const result: AxiosResponse = await request.post(params.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return parse(result, params.params || {});
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

export { get, post, put, del, uploadFile };
