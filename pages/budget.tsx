import { getSession } from 'next-auth/client';
import { GET_USER } from 'graphql/queries/GET_USER';
import { ADD_BUDGET } from 'graphql/queries/ADD_BUDGET';
import { initializeApollo } from 'lib/apolloClient';
import Budget from 'components/Budget';
import Layout from 'components/Layout';

const BudgetPage = () => (
  <Layout>
    <Budget />
  </Layout>
);
export default BudgetPage;

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo(null, context);
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/login' });
    context.res.end();
    return;
  }
  let data;
  try {
    data = await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });
  } catch (e) {
    console.log('couldnt find user!')
    console.log(session.user.email)
    await apolloClient.mutate({ mutation: ADD_BUDGET, variables: { email: session.user.email } });
    data = await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
