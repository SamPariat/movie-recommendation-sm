import { Auth, Tokens } from '~/types';
import request from '..';

const login = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue
): Promise<Tokens> => {
  const response = await request<Tokens>(
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
): Promise<Tokens> => {
  const response = await request<Tokens>(
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

const profile = async (): Promise<Auth> => {
  const response = await request<Auth>('get', '/profile');

  return response.data;
};

const logout = async (access_token: string): Promise<void> => {
  await request<void>(
    'post',
    '/auth/local/logout',
    undefined,
    undefined,
    {
      Authorization: `Bearer ${access_token}`,
    }
  );
};

const cycleTokens = async (
  refresh_token: string
): Promise<Tokens> => {
  const response = await request<Tokens>(
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

export { cycleTokens, login, logout, profile, signup };
