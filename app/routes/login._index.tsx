import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { MetaFunction } from '@remix-run/react';
import { getValidatedFormData } from 'remix-hook-form';

import { login, signup } from '~/api';
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
  const name: string | undefined = data.name;

  try {
    const tokens = name
      ? await signup(
          email as string,
          password as string,
          name as string
        )
      : await login(email as string, password as string);

    session.set('access_token', tokens.access_token);
    session.set('refresh_token', tokens.refresh_token);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    return json({ error });
  }
}

export default function Login() {
  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-3 justify-center items-center'>
        <img
          src='./images/login-3d.png'
          alt='Login.png'
          className='col-span-3 sm:col-span-1 items-center h-48 sm:h-auto'
          loading='lazy'
        />
        <div className='col-span-3 sm:col-span-2 px-8'>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
