import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import useUser from '../hooks/useUser';

function RequireLogin(Component) {
  return function ProtectedRoute(props) {
    const { loading, loggedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!loggedIn && !loading) router.push('/login');
    }, [loading, loggedIn, router]);
    if (loading) {
      return null;
    }
    if (!loggedIn) {
      return null;
    }
    return <Component loggedIn {...props} />;
  };
}
export default RequireLogin;
