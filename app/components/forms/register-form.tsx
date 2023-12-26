import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigation } from '@remix-run/react';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useRemixForm } from 'remix-hook-form';

import { RegisterFormData, registerFormSchema } from '~/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const registerFormVariants: Variants = {
  initial: {
    opacity: 0,
  },
  inView: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useRemixForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const navigation = useNavigation();

  return (
    <AnimatePresence key='register-form'>
      <Form
        className='space-y-2'
        method='post'
        onSubmit={handleSubmit}
      >
        <motion.div
          className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'
          variants={registerFormVariants}
          initial='initial'
          exit='exit'
          whileInView='inView'
        >
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
        </motion.div>
        <motion.div
          className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'
          variants={registerFormVariants}
          initial='initial'
          exit='exit'
          whileInView='inView'
        >
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
        </motion.div>
        <motion.div
          className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'
          variants={registerFormVariants}
          initial='initial'
          exit='exit'
          whileInView='inView'
        >
          <Label htmlFor='confirm-password'>Confirm Password</Label>
          <Input
            type='password'
            id='confirm-password'
            placeholder='Confirm Password'
            {...register('confirmPassword')}
          />
          <p className='text-xs font-semibold text-destructive'>
            {errors.confirmPassword?.message}
          </p>
        </motion.div>
        <motion.div
          className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2'
          variants={registerFormVariants}
          initial='initial'
          exit='exit'
          whileInView='inView'
        >
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
        </motion.div>
        <Button
          size='sm'
          type='submit'
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'idle'
            ? 'Register'
            : 'Registering...'}
        </Button>
      </Form>

      <DevTool control={control} />
    </AnimatePresence>
  );
};
