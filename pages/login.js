import Login from '../components/Login';
import { initializeApollo } from '../lib/apolloClient';
import { GET_ME } from '../lib/queries/GET_ME';

export default Login;
export async function getServerSideProps(context) {
  // getToken(context)
  // if no token or token isn't legit, redirect
  // ^ above could be done with a function called ensureAuth
  // if valid, continue with initializing apollo
  const apolloClient = initializeApollo(null, context);
  let data;
  try {
    data = await apolloClient.query({ query: GET_ME });
  } catch (e) {
    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  }
  if (data.data.me) {
    context.res.writeHead(302, { Location: '/budget' });
    context.res.end();
    return;
  }
  console.log(data);
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
