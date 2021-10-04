import axios, { AxiosInstance, AxiosError, Method, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { notification } from 'antd';
import { isDev } from './utils';

const BASE_URL = REACT_APP_API_URL;
const REFRESH_URL = '/api/token/refresh';
const V2_NEW_TOKEN = '/payroll/API/authentication/jwt.php';

declare module 'axios' {
  interface AxiosRequestConfig {
    refresh_token?: string;
    refreshToken?: string;
    suppressErrorCodes?: (string | number)[];
  }
}

export const typAxios = axios.create({
  baseURL: BASE_URL,
  suppressErrorCodes: [401], // suppress 401 by default
});

export const refreshAxios = axios.create({
  baseURL: BASE_URL,
});

const refreshAuthLogic401 = (axiosInstance: AxiosInstance): void => {
  const interceptor = axiosInstance.interceptors.response.use(
    ({ data }) => {
      return data;
    },
    () => {
      window.location.href = '/login/';
      axiosInstance.interceptors.response.eject(interceptor);
    },
  );
};

refreshAuthLogic401(refreshAxios);

const refreshAuthLogic = async (
  failedRequest: AxiosError,
): Promise<AxiosResponse> => {
  const {
    config: { refreshToken },
  } = failedRequest;

  try {
    if (isDev) {
      typAxios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${REACT_APP_ACCESSTOKEN}`;
      typAxios.defaults.refreshToken = REACT_APP_REFRESH_TOKEN;
      return;
    }

    //If a token exists then we'll try refresh the token, else, we'll request a brand new token from V2.
    const refresh_url = refreshToken ? REFRESH_URL : V2_NEW_TOKEN;

    const method: Method = refreshToken ? 'POST' : 'GET';

    const { token, refresh_token } = await refreshAxios(refresh_url, {
      withCredentials: true,
      refresh_token: refreshToken,
      method: method,
    });

    typAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    typAxios.defaults.refreshToken = refresh_token;

    return;
  } catch (error) {
    throw new Error(error);
  }
};

typAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      response: {
        status,
        config: { url, suppressErrorCodes },
      },
    } = error;
    const endpoint: string = url;
    // avoid message error popping if you don't want it to through suppressErrorCodes
    const shouldSuppressError = [
      ...typAxios.defaults.suppressErrorCodes,
      ...suppressErrorCodes,
    ].reduce((acc, item) => {
      // return acc if already true
      if (acc) {
        return acc;
      }

      const itemToNumber = +item;

      if (itemToNumber === status) {
        return true;
      }

      return false;
    }, false);

    if (shouldSuppressError) throw error;

    notification.error({
      message: `Request error ${status}: ${endpoint}`,
    });

    throw error;
  },
);
createAuthRefreshInterceptor(typAxios, refreshAuthLogic);

export default typAxios;
