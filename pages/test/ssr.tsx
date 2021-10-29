import { getSession } from 'next-auth/client';
import { Budget, EditBudgetStack } from 'components/Budget';
import Layout, { Main, Left, Center, Right } from 'components/Shared/Layout';
import { TabSidebar, ActionSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import { createContext, useState } from 'react';
import { AnimatePresence, Variants } from 'framer-motion';
import { StickyWrapper } from 'components/Styled/StickyWrapper';
import prisma from 'lib/prismaClient';
const variants: Variants = {
  open: { x: 0, transition: { type: 'just' }, opacity: 1 },
  closed: { x: '+100%', opacity: 0 },
};
const BudgetState = {
  stackInFocus: 0,
  setStackInFocus: null,
};
export const BudgetContext = createContext(BudgetState);
const BudgetPage = () => {
  const [stackId, setStackId] = useState<null | number>(null);
  return (
    <Layout>
      <Nav />
      <Main>
        <BudgetContext.Provider value={{ stackInFocus: stackId, setStackInFocus: setStackId }}>
          <Left>
            <TabSidebar />
          </Left>
          <Center>
            <Budget />
          </Center>
          <Right>
            <AnimatePresence>
              {stackId && (
                <ActionSidebar
                  initial="closed"
                  animate={stackId !== null ? 'open' : 'closed'}
                  variants={variants}
                  exit="closed"
                >
                  <StickyWrapper top="1rem">
                    {' '}
                    {/* Will only work for mobile */}
                    <EditBudgetStack id={stackId} />
                  </StickyWrapper>
                </ActionSidebar>
              )}
            </AnimatePresence>
          </Right>
        </BudgetContext.Provider>
      </Main>
    </Layout>
  );
};
export default BudgetPage;

export async function getServerSideProps(context) {
  const start = Date.now();

  const session = await getSession(context);
  const stop = Date.now();

  console.log(`time to fetch session = ${(stop - start) / 1000} seconds`);
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