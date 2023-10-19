import axios, { AxiosResponse, Method } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3523",
});

const request = <T>(
  method: Method,
  url: string,
  params: any
): Promise<AxiosResponse<T>> => {
  return api.request({
    method,
    url,
    params,
  });
};

export default request;
