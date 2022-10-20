import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/lib/modules/auth';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = async ({ request }) => {
  return authenticator.authenticate('google', request);
};
