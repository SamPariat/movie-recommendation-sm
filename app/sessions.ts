import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  access_token: string;
};

type SessionFlashData = { error: string };

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: 'token',
      secure: true,
      maxAge: 60 * 15,
    },
  });

export { commitSession, destroySession, getSession };
