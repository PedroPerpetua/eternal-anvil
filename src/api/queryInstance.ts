import axios, { isAxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

import { clearAuthToken, getAuthToken } from './authToken';
import i18n from '../translations/i18n';

const SERVER_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({ baseURL: new URL(SERVER_URL).toString() });

// On request, add the token and language
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.setAuthorization(`Token ${token}`);
  const { language } = i18n;
  if (language) config.headers.set('Accept-Language', language);
  return config;
});

// On an authentication failed, remove the token
axiosInstance.interceptors.response.use((response) => response, (error) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) clearAuthToken();
  }
  return Promise.reject(error);
});

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
