import { EditTransaction } from 'components/Transactions';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';

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
  const session = await getSession(context);
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
