import request, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { notification } from 'antd';

// 请求配置接口
interface IRequestConfig<T> {
  url: string;
  data?: T;
  handleRaw?: boolean;
  timeout?: number;
  cancelToken?: AbortController;
  retry?: number;
}

// 响应数据接口
interface IResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

// 错误消息接口
interface IErrorMessage {
  message: string;
  description: string;
  action?: () => void;
}

const apiPrefix = import.meta.env.VITE_APP_BASE_API;
const DEFAULT_TIMEOUT = 5000;

const instance = request.create({
  timeout: DEFAULT_TIMEOUT,
  baseURL: `/${apiPrefix}`,
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      handleError(status, data as IResponse);
    } else if (error.request) {
      notification.error({
        message: '网络错误',
        description: '请检查网络连接',
        placement: 'bottomRight',
      });
    } else {
      notification.error({
        message: '请求错误',
        description: error.message,
        placement: 'bottomRight',
      });
    }
    return Promise.reject(error);
  },
);

// 统一错误处理
const handleError = (status: number, data: IResponse) => {
  const errorMessages: Record<number, IErrorMessage> = {
    401: {
      message: '提示',
      description: '登录超时，请重新登录',
      action: () => (window.location.href = '/login'),
    },
    403: {
      message: '权限错误',
      description: '您没有权限访问该资源',
    },
    404: {
      message: '系统提示',
      description: '访问地址不存在，请联系管理员',
    },
    500: {
      message: '系统错误',
      description: data?.message || '服务器内部错误',
    },
  };

  const error = errorMessages[status] || {
    message: '错误',
    description: data?.message || '系统异常',
  };

  notification.error({
    message: error.message,
    description: error.description,
    placement: 'bottomRight',
  });

  if (error.action) {
    error.action();
  }
};

// 统一响应处理
const parse = <R>(res: AxiosResponse, params: { handleRaw: boolean }): R => {
  const { status, data } = res;
  const { handleRaw } = params;

  if (status === 200) {
    if (handleRaw) {
      return data as R;
    }
    if (data.code === 0) {
      return data.data as R;
    }
    handleError(status, data);
    return data.data as R;
  }

  handleError(status, data);
  return data.data as R;
};

const requestMethod = async <T, R>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  config: IRequestConfig<T>,
): Promise<R> => {
  const { retry = 0 } = config;
  let attempts = 0;

  while (attempts <= retry) {
    try {
      const { url, data, handleRaw, timeout = 5000, cancelToken } = config;
      const response = await instance({
        method,
        url,
        [method === 'GET' ? 'params' : 'data']: data,
        timeout,
        signal: cancelToken?.signal,
      });
      return parse<R>(response, { handleRaw: !!handleRaw });
    } catch (error) {
      attempts++;
      if (attempts > retry) {
        return Promise.reject(error);
      }
    }
  }

  throw new Error('请求失败，已达到最大重试次数');
};

// 导出请求方法
export const get = <T, R>(config: IRequestConfig<T>): Promise<R> =>
  requestMethod<T, R>('GET', config);

export const post = <T, R>(config: IRequestConfig<T>): Promise<R> =>
  requestMethod<T, R>('POST', config);

export const put = <T, R>(config: IRequestConfig<T>): Promise<R> =>
  requestMethod<T, R>('PUT', config);

export const del = <T, R>(config: IRequestConfig<T>): Promise<R> =>
  requestMethod<T, R>('DELETE', config);

// 文件上传方法
export const uploadSingleFile = async <T>(config: IRequestConfig<File | Blob>): Promise<T> => {
  if (!config.data) {
    throw new Error('File or Blob data is required');
  }

  const formData = new FormData();
  formData.append('file', config.data);

  try {
    const response = await instance({
      method: 'POST',
      url: config.url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: config.timeout,
      signal: config.cancelToken?.signal,
    });
    return parse(response, { handleRaw: !!config.handleRaw });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadFile = async <T>(config: IRequestConfig<File[] | Blob[]>): Promise<T> => {
  if (!Array.isArray(config.data)) {
    throw new Error('Data must be an array of File or Blob objects');
  }

  const formData = new FormData();
  config.data.forEach((file, index) => {
    if (!(file instanceof File || file instanceof Blob)) {
      throw new Error(`Element at index ${index} is not a File or Blob object`);
    }
    formData.append('files', file);
  });

  try {
    const response = await instance({
      method: 'POST',
      url: config.url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: config.timeout,
      signal: config.cancelToken?.signal,
    });
    return parse(response, { handleRaw: !!config.handleRaw });
  } catch (error) {
    return Promise.reject(error);
  }
};
