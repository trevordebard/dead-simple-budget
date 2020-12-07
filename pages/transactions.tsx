import { getSession } from 'next-auth/client';
import { GET_USER } from 'graphql/queries/GET_USER';
import Transactions from 'components/Transactions';
import { initializeApollo } from 'lib/apolloClient';
import Layout, { Main, Left, Center } from 'components/Layout';
import TabSidebar from 'components/TabSidebar';
import Nav from 'components/nav';
import { StickyWrapper } from 'components/styled';

const TransactionPage = () => (
  <Layout>
    <Nav />
    <Main>
      <Left>
        <StickyWrapper top="1rem">
          <TabSidebar />
        </StickyWrapper>
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
