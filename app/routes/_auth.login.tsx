import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { MetaFunction } from '@remix-run/react';
import { AxiosError } from 'axios';
import { getValidatedFormData } from 'remix-hook-form';
import { jsonWithError, redirectWithSuccess } from 'remix-toast';

import { login } from '~/api';
import { AuthForm } from '~/components/forms';
import { commitSession, getSession } from '~/sessions';
import { authFormSchema } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'CineSuggest | Login' },
    {
      name: 'description',
      content: 'Authenticate yourself to add reviews',
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('access_token') && session.has('refresh_token')) {
    return redirect('/');
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(
    request,
    zodResolver(authFormSchema)
  );

  if (errors) {
    return json({
      errors,
      defaultValues,
    });
  }

  const email: string = data.email;
  const password: string = data.password;

  try {
    const tokens = await login(email as string, password as string);

    session.set('access_token', tokens.access_token);
    session.set('refresh_token', tokens.refresh_token);

    return redirectWithSuccess('/', 'Welcome back.', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return jsonWithError(null, error.response?.data.message);
    }
    return jsonWithError(null, 'Error');
  }
}

export default function AuthLogin() {
  return <AuthForm />;
}
