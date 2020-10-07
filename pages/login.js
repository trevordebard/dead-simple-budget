import { getSession } from 'next-auth/client';
import Login from '../components/Login';

export default Login;
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    context.res.writeHead(302, { Location: '/budget' });
    context.res.end();
    return;
  }
  return {
    props: {},
  };
}
