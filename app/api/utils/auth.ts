import { IAuth, ITokens } from '~/types';
import request from '..';

const login = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue
): Promise<ITokens> => {
  const response = await request<ITokens>(
    'post',
    '/auth/local/login',
    undefined,
    {
      email,
      password,
    }
  );

  return response.data;
};

const signup = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue,
  name: FormDataEntryValue
): Promise<ITokens> => {
  const response = await request<ITokens>(
    'post',
    '/auth/local/signup',
    undefined,
    {
      email,
      password,
      name,
    }
  );

  return response.data;
};

const profile = async (): Promise<IAuth> => {
  const response = await request<IAuth>('get', '/profile');

  return response.data;
};

const logout = async (): Promise<void> => {
  await request<void>('post', '/auth/local/logout');
};

const refreshToken = async (
  refresh_token: string
): Promise<ITokens> => {
  const response = await request<ITokens>(
    'post',
    '/auth/refresh',
    undefined,
    undefined,
    {
      Authorization: `Bearer ${refresh_token}`,
    }
  );

  return response.data;
};

export { login, logout, profile, signup, refreshToken };
