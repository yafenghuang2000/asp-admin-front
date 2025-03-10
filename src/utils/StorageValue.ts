import Cookies from 'js-cookie';

interface ISetCookieType {
  key: string;
  value: string;
  options: Cookies.CookieAttributes;
}

export const setCookie = ({ key, value, options }: ISetCookieType): void => {
  Cookies.set(key, value, options);
};

export const getCookie = (key: string): string | undefined => Cookies.get(key);

export const removeCookie = (key: string): void => {
  Cookies.remove(key);
};

// 定义存储数据的类型
type StorageValue = string | Record<string, unknown> | null;

/**
 * 存储数据到 storage
 * @param storage 存储对象（localStorage 或 sessionStorage）
 * @param key 存储的键名
 * @param value 存储的值（可以是字符串或对象）
 */
const setStorage = (storage: Storage, key: string, value: StorageValue): void => {
  if (typeof value === 'object' && value !== null) {
    // 如果值是对象，转换为 JSON 字符串存储
    storage.setItem(key, JSON.stringify(value));
  } else {
    // 否则直接存储
    storage.setItem(key, value as string);
  }
};

/**
 * 从 storage 获取数据
 * @param storage 存储对象（localStorage 或 sessionStorage）
 * @param key 获取的键名
 * @returns 存储的值（字符串或对象）
 */
const getStorage = (storage: Storage, key: string): StorageValue => {
  const value = storage.getItem(key);
  if (value && (value.startsWith('{') || value.startsWith('['))) {
    // 如果值是 JSON 字符串，解析为对象
    try {
      return JSON.parse(value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse storage value:', error);
      return value;
    }
  }
  return value;
};

/**
 * 从 storage 移除数据
 * @param storage 存储对象（localStorage 或 sessionStorage）
 * @param key 移除的键名
 */
const removeStorage = (storage: Storage, key: string): void => {
  storage.removeItem(key);
};

/**
 * 清空 storage
 * @param storage 存储对象（localStorage 或 sessionStorage）
 */
const clearStorage = (storage: Storage): void => {
  storage.clear();
};

// localStorage 相关方法
export const setLocalStorage = (key: string, value: StorageValue): void =>
  setStorage(localStorage, key, value);

export const getLocalStorage = (key: string): StorageValue => getStorage(localStorage, key);

export const removeLocalStorage = (key: string): void => removeStorage(localStorage, key);

export const clearLocalStorage = (): void => clearStorage(localStorage);

// sessionStorage 相关方法
export const setSessionStorage = (key: string, value: StorageValue): void =>
  setStorage(sessionStorage, key, value);

export const getSessionStorage = (key: string): StorageValue => getStorage(sessionStorage, key);

export const removeSessionStorage = (key: string): void => removeStorage(sessionStorage, key);

export const clearSessionStorage = (): void => clearStorage(sessionStorage);
