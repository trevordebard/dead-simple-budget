import { LoaderFunction, redirect } from "remix";
import { authenticator } from "~/auth/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);
  if (user) return redirect("/budget");
  return null;
};
export default function Login() {
  return (
    <form action="/auth/google" method="post">
      <button>Login with Google</button>
    </form>
  );
}