import { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/lib/modules/auth/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate('google', request, {
    successRedirect: '/budget',
    failureRedirect: '/login',
  });
};
