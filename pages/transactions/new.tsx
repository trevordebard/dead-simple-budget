import NewTransaction from 'components/NewTransaction';
import { GET_USER } from 'graphql/queries/GET_USER';
import { initializeApollo } from 'lib/apolloClient';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import Layout, { Main, Left, Center } from 'components/Layout';
import TabSidebar from 'components/TabSidebar';
import Nav from 'components/nav';

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
  await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
