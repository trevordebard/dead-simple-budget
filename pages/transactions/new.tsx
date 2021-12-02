import { NewTransaction } from 'components/Transactions';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { GetServerSidePropsContext } from 'next';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

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
        <Center>
          <NewTransaction />
        </Center>
      </Main>
    </Layout>
  );
};
export default NewTransactionPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
