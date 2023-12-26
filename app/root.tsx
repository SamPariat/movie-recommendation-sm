import { cssBundleHref } from '@remix-run/css-bundle';
import {
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
import { useEffect } from 'react';
import { getToast } from 'remix-toast';
import { toast as sonnerToast } from 'sonner';

import { TopNav } from './components/navigation';
import { Toaster } from './components/ui/sonner';
import tailwind from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind },
  ...(cssBundleHref
    ? [{ rel: 'stylesheet', href: cssBundleHref }]
    : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
}

export default function App() {
  const { toast } = useLoaderData<typeof loader>();

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
        <TopNav />
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
