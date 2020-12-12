import { getSession } from 'next-auth/client';
import { GET_USER } from 'components/GET_USER';
import { Transactions } from 'components/Transactions';
import { initializeApollo } from 'lib/apolloClient';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';

const TransactionPage = () => (
  <Layout>
    <Nav />
    <Main>
      <Left>
        <TabSidebar />
      </Left>
      <Center><Transactions /></Center>
    </Main>
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
