import { getSession } from 'next-auth/client';
import { Transactions } from 'components/Transactions';
import { initializeApollo } from 'lib/apolloClient';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import prisma from 'lib/prismaClient';

const TransactionPage = () => (
  <Layout>
    <Nav />
    <Main>
      <Left>
        <TabSidebar />
      </Left>
      <Center>
        <Transactions />
      </Center>
    </Main>
  </Layout>
);
export default TransactionPage;
export async function getServerSideProps(context) {
  const apolloClient = initializeApollo(null, context);
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const accessTokenResponse = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { bankAccounts: true },
  });

  const accessTokens = accessTokenResponse.bankAccounts.map(entry => entry.plaidAccessToken);
  if (accessTokens.length < 1) {
    return {
      redirect: {
        permanent: false,
        destination: '/plaid',
      },
    };
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
