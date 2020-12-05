import { getSession } from 'next-auth/client';
import { GET_USER } from 'graphql/queries/GET_USER';
import { ADD_BUDGET } from 'graphql/queries/ADD_BUDGET';
import { initializeApollo } from 'lib/apolloClient';
import Budget from 'components/Budget';
import Layout, { Main, Left, Center, Right } from 'components/Layout';
import TabSidebar from 'components/TabSidebar';
import Nav from 'components/nav';
import { createContext, useState } from 'react';
import EditBudgetStack from 'components/EditBudgetStack';
import { AnimatePresence, Variants } from "framer-motion"

const variants: Variants = {
  open: { y: 0, transition: { type: "just" }, opacity: 1 },
  closed: { y: "+100%", opacity: 0 },
}
const BudgetState = {
  stackInFocus: 0,
  setStackInFocus: null
}
export const BudgetContext = createContext(BudgetState);

const BudgetPage = () => {
  const [stackId, setStackId] = useState<null | number>(null)
  return (
    <Layout>
      <Nav />
      <Main>
        <BudgetContext.Provider value={{ stackInFocus: stackId, setStackInFocus: setStackId }}>
          <Left>
            <TabSidebar />
          </Left>
          <Center><Budget /></Center>
          <Right
            animate={stackId !== null ? "open" : "closed"}
            variants={variants}>
            <AnimatePresence>
              {stackId && (
                <EditBudgetStack id={stackId} />
              )}
            </AnimatePresence>
          </Right>
        </BudgetContext.Provider>
      </Main>
    </Layout>
  )
};
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
