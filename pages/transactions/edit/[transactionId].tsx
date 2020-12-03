import EditTransaction from 'components/EditTransaction';
import { GET_USER } from 'graphql/queries/GET_USER';
import { initializeApollo } from 'lib/apolloClient';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Layout, { Main, Left, Center } from 'components/Layout';
import TabSidebar from 'components/TabSidebar';
import Nav from 'components/nav';

const Transaction = () => {
  const router = useRouter();
  const { transactionId } = router.query;
  return (
    <Layout>
      <Nav />
      <Main>
        <Left>
          <TabSidebar />
        </Left>
        <Center>
          <EditTransaction transactionId={Number(transactionId)} cancelEdit={() => router.push('/transactions')} />
        </Center>
      </Main>
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
