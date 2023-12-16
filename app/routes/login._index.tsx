import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, MetaFunction, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { login, signup } from '~/api';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { commitSession, getSession } from '~/sessions';
import { formFieldSchema } from '~/types';

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

  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');

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
  const {
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formFieldSchema>>({
    resolver: zodResolver(formFieldSchema),
  });
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-3 justify-center items-center'>
        <img
          src='./images/login-3d.png'
          alt='Login.png'
          className='col-span-3 sm:col-span-1 items-center h-48 sm:h-auto'
        />
        <div className='col-span-3 sm:col-span-2 px-8'>
          <Form className='space-y-2' method='post'>
            <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                type='email'
                id='email'
                placeholder='Email'
                {...register('email')}
              />
              <p className='text-xs font-semibold text-destructive'>
                {errors.email?.message}
              </p>
            </div>
            <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                id='password'
                placeholder='Password'
                {...register('password')}
              />
              <p className='text-xs font-semibold text-destructive'>
                {errors.password?.message}
              </p>
            </div>
            {!isLogin && (
              <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  type='text'
                  id='name'
                  placeholder='Name'
                  {...register('name')}
                />
                <p className='text-xs font-semibold text-destructive'>
                  {errors.name?.message}
                </p>
              </div>
            )}
            <Button
              size='sm'
              disabled={navigation.state === 'submitting'}
            >
              {navigation.state === 'idle'
                ? isLogin
                  ? 'Login'
                  : 'Register'
                : 'Logging in...'}
            </Button>
          </Form>
          <p
            className='text-sm mt-4 cursor-pointer underline underline-offset-4'
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Create one."
              : 'Already have an account? Log in instead.'}
          </p>
        </div>
      </div>
    </div>
  );
}
