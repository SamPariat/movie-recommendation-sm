import { Link, Outlet, useLocation } from '@remix-run/react';

export default function AuthLayout() {
  const location = useLocation();

  const isLogin = location.pathname === '/login';

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
          <Outlet />
          <Link
            to={isLogin ? '/register' : '/login'}
            prefetch='intent'
            replace
            className='text-sm underline text-primary'
          >
            {isLogin
              ? "Don't have an account? Sign up."
              : 'Already have an account? Sign in.'}
          </Link>
        </div>
      </div>
    </div>
  );
}
