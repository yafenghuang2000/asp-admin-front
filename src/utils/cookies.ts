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
