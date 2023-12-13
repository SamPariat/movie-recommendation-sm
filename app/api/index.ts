import axios, { AxiosResponse, Method } from 'axios';

export * from './utils';

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
});

const request = <T>(
  method: Method,
  url: string,
  params?: any,
  data?: any
): Promise<AxiosResponse<T>> => {
  return api.request({
    method,
    url,
    params,
    data,
    withCredentials: true,
  });
};

export default request;
