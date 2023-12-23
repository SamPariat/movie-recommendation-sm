import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  access_token: string;
  refresh_token: string;
};

type SessionFlashData = { error: string; message: string };

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: 'token',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      secrets: [process.env.COOKIE_SECRET ?? ''],
    },
  });

export { commitSession, destroySession, getSession };
