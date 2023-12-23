import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigation } from '@remix-run/react';
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
        <Button
          size='sm'
          type='submit'
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'idle' ? 'Login' : 'Logging in...'}
        </Button>
      </Form>

      <DevTool control={control} />
    </>
  );
};
