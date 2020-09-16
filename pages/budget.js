import { gql } from '@apollo/client';
import Budget from '../components/Budget';
import Layout from '../components/Layout';
import { initializeApollo } from '../lib/apolloClient';

const TestMe = gql`
  query TestMe {
    me {
      id
      email
      budget {
        id
        userId
        total
        toBeBudgeted
        stacks {
          id
          label
          amount
        }
      }
    }
  }
`;
const BudgetPage = () => (
  <Layout>
    <Budget />
  </Layout>
);
export default BudgetPage;

export async function getServerSideProps(context) {
  // getToken(context)
  // if no token or token isn't legit, redirect
  // ^ above could be done with a function called ensureAuth
  // if valid, continue with initializing apollo
  const apolloClient = initializeApollo(null, context);
  try {
    const data = await apolloClient.query({ query: TestMe });
  } catch (e) {
    if (e.graphQLErrors[0].message.toLowerCase() === 'not authorized!') {
      console.error('not authorized');
      context.res.writeHead(302, { Location: '/login' });
      context.res.end();
      return;
    }
  }
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
