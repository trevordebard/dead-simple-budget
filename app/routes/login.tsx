import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/auth/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (user) return redirect('/budget');
  return null;
};
export default function Login() {
  return (
    <form action="/auth/google" method="post">
      <button type="submit">Login with Google</button>
    </form>
  );
}
