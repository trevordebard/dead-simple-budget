import EditTransaction from 'components/EditTransaction';
import Layout from 'components/Layout';
import { GET_USER } from 'graphql/queries/GET_USER';
import { initializeApollo } from 'lib/apolloClient';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const Transaction = () => {
  const router = useRouter();
  const { transactionId } = router.query;
  return (
    <Layout>
      <EditTransaction transactionId={parseInt(transactionId, 10)} cancelEdit={() => router.push('/transactions')} />
    </Layout>
  );
};
export default Transaction;
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
