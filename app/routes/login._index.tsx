import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { MetaFunction } from '@remix-run/react';
import { getValidatedFormData } from 'remix-hook-form';
import { jsonWithError, redirectWithSuccess } from 'remix-toast';

import { login, signup } from '~/api';
import { AuthForm, RegisterForm } from '~/components/forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs';
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
  const confirmPassword: string | undefined = data.confirmPassword;

  const isLogin = !name && !confirmPassword;

  try {
    const tokens = !isLogin
      ? await signup(
          email as string,
          password as string,
          name as string
        )
      : await login(email as string, password as string);

    session.set('access_token', tokens.access_token);
    session.set('refresh_token', tokens.refresh_token);

    return redirectWithSuccess(
      '/',
      isLogin
        ? 'Welcome back.'
        : 'Successfully registered! Start using the application.',
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
        <div className='col-span-3 sm:col-span-2 px-4 my-4'>
          <Tabs
            defaultValue='login'
            className='w-[250px] md:w-[600px]'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='register'>Register</TabsTrigger>
            </TabsList>
            <TabsContent value='login'>
              <AuthForm />
            </TabsContent>
            <TabsContent value='register'>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
