import { EditStack } from 'components/Stack';
import { getSession } from 'next-auth/react';
import { Budget } from 'components/Budget';
import Layout, { Main, Left, Center, Right } from 'components/Shared/Layout';
import { TabSidebar, ActionSidebar } from 'components/Sidebar';
import { Nav } from 'components/Nav';
import { createContext, useState } from 'react';
import { AnimatePresence, Variants } from 'framer-motion';
import { StickyWrapper } from 'components/Styled/StickyWrapper';
import { EditStackCategory } from 'components/Stack/EditStackCategory';
const variants: Variants = {
  open: { x: 0, transition: { type: 'just' }, opacity: 1 },
  closed: { x: '+100%', opacity: 0 },
};

// TODO: this is a good candidate for a state machine
const BudgetState = {
  stackInFocus: 0,
  setStackInFocus: null,
  categoryInFocus: 0,
  setCategoryInFocus: null,
};
export const BudgetContext = createContext(BudgetState);
const BudgetPage = () => {
  const [stackId, setStackId] = useState<null | number>(null);
  const [categoryInFocus, setCategoryInFocus] = useState<null | number>(null);
  return (
    <Layout>
      <Nav />
      <Main>
        <BudgetContext.Provider
          value={{ stackInFocus: stackId, setStackInFocus: setStackId, categoryInFocus, setCategoryInFocus }}
        >
          <Left>
            <TabSidebar />
          </Left>
          <Center>
            <Budget />
          </Center>
          <Right>
            <AnimatePresence>
              {(stackId || categoryInFocus) && (
                <ActionSidebar
                  initial="closed"
                  animate={(stackId || categoryInFocus) !== null ? 'open' : 'closed'}
                  variants={variants}
                  exit="closed"
                >
                  <StickyWrapper top="1rem">
                    {stackId && <EditStack id={stackId} />}
                    {categoryInFocus && <EditStackCategory id={categoryInFocus} />}
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
