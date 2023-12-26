import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { MetaFunction } from '@remix-run/react';
import { getValidatedFormData } from 'remix-hook-form';
import { jsonWithError, redirectWithSuccess } from 'remix-toast';

import { login, signup } from '~/api';
import { RegisterForm } from '~/components/forms';
import { commitSession, getSession } from '~/sessions';
import { authFormSchema, registerFormSchema } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'CineSuggest | Register' },
    {
      name: 'description',
      content: 'Join in on the conversation',
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(
    request,
    zodResolver(registerFormSchema)
  );

  if (errors) {
    return json({
      errors,
      defaultValues,
    });
  }

  const email: string = data.email;
  const password: string = data.password;
  const name: string = data.name;

  try {
    const tokens = await signup(
      email as string,
      password as string,
      name as string
    );

    session.set('access_token', tokens.access_token);
    session.set('refresh_token', tokens.refresh_token);

    return redirectWithSuccess(
      '/',
      'Successfully registered! Start using the application.',
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  } catch (error) {
    return jsonWithError(null, 'Error');
  }
}

export default function AuthLogin() {
  return <RegisterForm />;
}
