import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { useRemixForm } from 'remix-hook-form';

import { AuthFormData, authFormSchema } from '~/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const AuthForm = () => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useRemixForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
  });

  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <>
      <Form
        className='space-y-2'
        method='post'
        onSubmit={handleSubmit}
      >
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
          type='submit'
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
        className='text-sm mt-4 cursor-pointer underline underline-offset-4 w-fit'
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Create one."
          : 'Already have an account? Log in instead.'}
      </p>

      <DevTool control={control} />
    </>
  );
};
