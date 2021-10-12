import { getSession } from 'next-auth/client';
import { Import } from 'components/Transactions/Import';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import prisma from 'lib/prismaClient';

const ImportPage = () => (
  <Layout>
    <Nav />
    <Main>
      <Left>
        <TabSidebar />
      </Left>
      <Center>
        <Import />
      </Center>
    </Main>
  </Layout>
);
export default ImportPage;

export async function getServerSideProps(context) {
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
      session,
    },
  };
}
