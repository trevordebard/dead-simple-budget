import { NewTransaction } from 'components/Transactions';
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
        <Center>
          <NewTransaction />
        </Center>
      </Main>
    </Layout>
  );
};
export default NewTransactionPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    context.res.setHeader('location', '/login');
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: null,
    };
  }

  return {
    props: {
      session,
    },
  };
}
