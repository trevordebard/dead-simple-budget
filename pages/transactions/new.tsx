import { NewTransaction } from 'components/Transactions';
import { initializeApollo } from 'lib/apolloClient';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { GetServerSidePropsContext } from 'next';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';

const NewTransactionPage: FunctionComponent = () => {
  const router = useRouter();
  const { transactionId } = router.query;
  return (
    <Layout>
      <Nav />
      <Main>
        <Left>
          <TabSidebar />
        </Left>
        <Center><NewTransaction /></Center>
      </Main>
    </Layout>
  );
};
export default NewTransactionPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo(null, context);
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/login' });
    context.res.end();
    return null;
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
