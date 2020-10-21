import { getSession } from 'next-auth/client';
import { GET_USER } from 'graphql/queries/GET_USER';
import Transactions from 'components/Transactions';
import Layout from 'components/Layout';
import { initializeApollo } from 'lib/apolloClient';

const TransactionPage = () => (
  <Layout>
    <Transactions />
  </Layout>
);
export default TransactionPage;
export async function getServerSideProps(context) {
  const apolloClient = initializeApollo(null, context);
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/login' });
    context.res.end();
    return null;
  }
  await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
