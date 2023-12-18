import axios, {
  AxiosResponse,
  Method,
  RawAxiosRequestHeaders,
} from 'axios';

export * from './utils';

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
});

const request = <T>(
  method: Method,
  url: string,
  params?: any,
  data?: any,
  headers?: RawAxiosRequestHeaders
): Promise<AxiosResponse<T>> => {
  return api.request({
    method,
    url,
    params,
    data,
    headers,
    withCredentials: true,
  });
};

export default request;
