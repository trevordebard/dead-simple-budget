import { getServerSession } from 'next-auth';
import Login from '../components/Login';
import { authOptions } from './api/auth/[...nextauth]';

export default Login;
export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions);

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
