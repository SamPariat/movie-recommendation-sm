import axios, { AxiosResponse, Method } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const request = <T>(
  method: Method,
  url: string,
  params: any,
  data: any
): Promise<AxiosResponse<T>> => {
  return api.request({
    method,
    url,
    params,
    data,
  });
};

export default request;
