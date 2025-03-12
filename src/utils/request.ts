import request, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { notification } from 'antd';

interface IResponseConfig<T> {
  url: string;
  data?: T;
  handleRaw?: boolean;
}

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const parse = (res: AxiosResponse, params: { handleRaw: boolean }) => {
  const { status, data } = res;
  const { handleRaw } = params || {};
  switch (status) {
    case 200:
      if (handleRaw) {
        return data;
      }
      if (data.code === 0) {
        return data.data;
      } else if (data.code === 401) {
        notification.open({
          type: 'warning',
          message: '提示',
          description: '登陆超时,请你重新登陆',
          placement: 'bottomRight',
          duration: 5000,
        });
        window.location.href = '/login';
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
      window.location.href = '/login';
      break;
    case 404:
      notification.open({
        type: 'warning',
        message: '系统提示',
        description: '访问地址不存在,请联系管理',
        placement: 'bottomRight',
      });
      break;
    default:
      notification.open({
        type: 'error',
        message: '提示',
        description: data.message || '系统异常',
        placement: 'bottomRight',
        duration: 5000,
      });
  }
};

const get = async <T>(data: IResponseConfig<T>): Promise<T> => {
  try {
    const response: AxiosResponse = await request({
      method: 'GET',
      url: data.url,
      params: data.data,
    });
    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams) as unknown as T;
  } catch (e) {
    return Promise.reject(e);
  }
};

const post = async <T>(data: IResponseConfig<T>): Promise<T> => {
  try {
    const response: AxiosResponse = await request({
      method: 'POST',
      url: data.url,
      data: data.data,
    });
    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams);
  } catch (error) {
    return Promise.reject(error);
  }
};

const put = async <T>(data: IResponseConfig<T>): Promise<T> => {
  try {
    const response: AxiosResponse = await request({
      method: 'PUT',
      url: data.url,
      data: data.data,
    });
    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const del = async <T>(data: IResponseConfig<T>): Promise<T> => {
  try {
    const response: AxiosResponse = await request({
      method: 'DELETE',
      url: data.url,
      data: data.data,
    });
    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const uploadSingleFile = async <T>(data: IResponseConfig<File | Blob>): Promise<T> => {
  if (!data.data) {
    throw new Error('File or Blob data is required');
  }

  try {
    const formData = new FormData();
    formData.append('file', data.data);
    const response = await request({
      method: 'POST',
      url: data.url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams);
  } catch (error) {
    return Promise.reject(error);
  }
};

const uploadFile = async <T>(data: IResponseConfig<File[] | Blob[]>): Promise<T> => {
  if (!Array.isArray(data.data)) {
    throw new Error('Data must be an array of File or Blob objects');
  }

  const formData = new FormData();
  data.data.forEach((file, index) => {
    if (!(file instanceof File || file instanceof Blob)) {
      throw new Error(`Element at index ${index} is not a File or Blob object`);
    }
    formData.append('files', file); // 使用 'files' 作为字段名以支持多个文件
  });

  try {
    const response = await request({
      method: 'POST',
      url: data.url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const parsedParams = { handleRaw: !!data.handleRaw };
    return parse(response, parsedParams);
  } catch (error) {
    return Promise.reject(error);
  }
};

export { get, post, put, del, uploadSingleFile, uploadFile };
