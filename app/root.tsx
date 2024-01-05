import { cssBundleHref } from '@remix-run/css-bundle';
import {
  ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import {
  getToast,
  jsonWithError,
  redirectWithSuccess,
} from 'remix-toast';
import { toast as sonnerToast } from 'sonner';

import { cycleTokens, logout } from './api';
import { TopNav } from './components/navigation';
import { Toaster } from './components/ui/sonner';
import { AuthContext } from './context';
import { commitSession, getSession } from './sessions';
import tailwind from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind },
  ...(cssBundleHref
    ? [{ rel: 'stylesheet', href: cssBundleHref }]
    : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);

  const session = await getSession(request.headers.get('Cookie'));

  return json(
    {
      toast,
      isAuth:
        session.has('access_token') && session.has('refresh_token'),
    },
    { headers }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  try {
    await logout(session.get('access_token')!);

    session.unset('access_token');
    session.unset('refresh_token');

    return redirectWithSuccess(
      '/login',
      'Successfully logged out. Login to comment again.',
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const tokens = await cycleTokens(
          session.get('refresh_token')!
        );

        await logout(tokens.access_token);

        session.unset('access_token');
        session.unset('refresh_token');

        return redirectWithSuccess(
          '/login',
          'Successfully logged out. Login to comment again.',
          {
            headers: {
              'Set-Cookie': await commitSession(session),
            },
          }
        );
      }

      throw jsonWithError(null, error.response?.data.message);
    }

    throw jsonWithError(null, 'Some error occurred.');
  }
}

export default function App() {
  const { toast, isAuth } = useLoaderData<typeof loader>();

  useEffect(() => {
    switch (toast?.type) {
      case 'error':
        sonnerToast.error(toast.message);
        break;
      case 'info':
        sonnerToast.info(toast.message);
        break;
      case 'success':
        sonnerToast.success(toast.message);
        break;
      case 'warning':
        sonnerToast.warning(toast.message);
        break;
    }
  }, [toast]);

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <Meta />
        <Links />
      </head>
      <body className='dark'>
        <AuthContext.Provider value={{ isAuth }}>
          <TopNav />
        </AuthContext.Provider>
        <main className='flex flex-col px-6 md:px-12 mt-24 space-y-4'>
          <Outlet />
        </main>
        <Toaster position='bottom-right' />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
