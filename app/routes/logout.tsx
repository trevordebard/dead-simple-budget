import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/lib/modules/auth';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = () => {
  throw new Response('', { status: 404 });
};
