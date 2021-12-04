export default function Login() {
  return (
    <form action="/auth/google" method="post">
      <button>Login with Google</button>
    </form>
  );
}