import { createCookieSessionStorage, Session } from '@remix-run/node';

// TODO: update secret
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cr3ts'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export const { commitSession, destroySession } = sessionStorage;
