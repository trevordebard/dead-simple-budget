import { getSession } from 'next-auth/client';
import Login from '../components/Login';

export default Login;
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/budget',
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
