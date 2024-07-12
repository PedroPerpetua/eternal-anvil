import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { applyAuthTokenInterceptor } from 'axios-jwt';

import type { TokenRefresh } from './models';
import i18n from '../translations/i18n';

const SERVER_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({ baseURL: new URL(SERVER_URL).toString() });

// Apply the language on the instance
axiosInstance.interceptors.request.use((config) => {
  const { language } = i18n;
  if (language) config.headers.set('Accept-Language', language);
  return config;
});

// Apply the JWT refresh
applyAuthTokenInterceptor(axiosInstance, { requestRefresh: async (refreshToken) => {
  const res = await axios.post<TokenRefresh>(
    '/users/login/refresh/',
    { refresh: refreshToken },
    { baseURL: SERVER_URL },
  );
  return { accessToken: res.data.access, refreshToken: res.data.refresh };
} });

export const queryInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({ ...config, ...options, cancelToken: source.token })
    .then(({ data }) => data);
  // @ts-ignore
  promise.cancel = () => { source.cancel('Query was canceled'); };
  return promise;
};

export default queryInstance;
