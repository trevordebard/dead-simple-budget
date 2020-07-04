import { useEffect } from 'react';
import { useRouter } from 'next/router';

import RequireLogin from '../components/RequireLogin';

const IndexPage = props => {
  const router = useRouter();
  useEffect(() => {
    if (props?.loggedIn) {
      console.log(props);
      router.push('/budget');
    }
  }, [props, router]);
  return null;
};

export default RequireLogin(IndexPage);
