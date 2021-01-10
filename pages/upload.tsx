import { getSession } from 'next-auth/client';
import { GET_USER } from 'components/GET_USER';
import { Upload } from 'components/Transactions';
import { initializeApollo } from 'lib/apolloClient';
import Layout, { Main, Left, Center } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';

const UploadPage = () => (
  <Layout>
    <Nav />
    <Main>
      <Left>
        <TabSidebar />
      </Left>
      <Center><Upload /></Center>
    </Main>
  </Layout>
);
export default UploadPage;

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo(null, context);
  const session = await getSession(context);
  if (!session) {
    context.res.setHeader("location", "/login");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: null
    };
  }
  await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
