import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { destroySession, getSession } from '~/auth/session.server';

export const action: ActionFunction = async ({ request }) => {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(await getSession(request)),
    },
  });
};

export const loader: LoaderFunction = () => {
  throw new Response('', { status: 404 });
};
