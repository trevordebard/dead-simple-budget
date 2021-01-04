import { getSession } from 'next-auth/client';
import { ADD_BUDGET } from 'components/Budget/queries/ADD_BUDGET';
import { initializeApollo } from 'lib/apolloClient';
import { Budget, EditBudgetStack } from 'components/Budget';
import Layout, { Main, Left, Center, Right } from 'components/Shared/Layout';
import { TabSidebar, ActionSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import { createContext, useState } from 'react';
import { AnimatePresence, Variants } from "framer-motion"
import { StickyWrapper } from 'components/Styled/StickyWrapper'
import { GET_BUDGET } from 'components/Budget/queries/GET_BUDGET';
const variants: Variants = {
  open: { x: 0, transition: { type: "just" }, opacity: 1 },
  closed: { x: "+100%", opacity: 0 },
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
          <Right>
            <AnimatePresence>
              {stackId && (
                <ActionSidebar
                  initial="closed"
                  animate={stackId !== null ? "open" : "closed"}
                  variants={variants} exit="closed"
                >
                  <StickyWrapper top="1rem"> {/* Will only work for mobile */}
                    <EditBudgetStack id={stackId} />
                  </StickyWrapper>
                </ActionSidebar>
              )}
            </AnimatePresence>
          </Right>
        </BudgetContext.Provider>
      </Main>
    </Layout >
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
    data = await apolloClient.query({ query: GET_BUDGET, variables: { email: session.user.email } });
  } catch (e) {
    console.log('couldnt find user!')
    console.log(session.user.email)
    await apolloClient.mutate({ mutation: ADD_BUDGET, variables: { email: session.user.email } });
    data = await apolloClient.query({ query: GET_BUDGET, variables: { email: session.user.email } });
  }
  if (data.data.budgets.length === 0) {
    await apolloClient.mutate({ mutation: ADD_BUDGET, variables: { email: session.user.email } });
    data = await apolloClient.query({ query: GET_BUDGET, variables: { email: session.user.email } });
  }
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      session,
    },
  };
}
