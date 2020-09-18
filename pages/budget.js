import Budget from '../components/Budget';
import Layout from '../components/Layout';
import { initializeApollo } from '../lib/apolloClient';
import { GET_ME } from '../lib/queries/GET_ME';

const BudgetPage = () => (
  <Layout>
    <Budget />
  </Layout>
);
export default BudgetPage;

export async function getServerSideProps(context) {
  // getToken(context)
  // if no token or token isn't legit, redirect
  // ^ above could be done with a function called ensureAuth
  // if valid, continue with initializing apollo
  const apolloClient = initializeApollo(null, context);
  try {
    const data = await apolloClient.query({ query: GET_ME });
  } catch (e) {
    if (e.graphQLErrors[0].message.toLowerCase() === 'not authorized!') {
      console.error('not authorized');
      context.res.writeHead(302, { Location: '/login' });
      context.res.end();
      return;
    }
  }
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
