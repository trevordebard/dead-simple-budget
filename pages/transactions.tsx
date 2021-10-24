import { Nav } from 'components/Nav';
import { ActionSidebar, TabSidebar } from 'components/Sidebar';
import { EditTransaction, TransactionPageContext, Transactions } from 'components/Transactions';
import Layout, { Main, Left, Center, Right } from 'components/Shared/Layout';
import { getSession } from 'next-auth/client';
import styled from 'styled-components';
import Link from 'next/link';

import { useState } from 'react';
import { Button } from 'components/Styled';
import { useDeleteTransactions } from 'lib/hooks';
import { useQueryClient } from 'react-query';
import { smBreakpoint } from 'lib/constants';
import { AnimatePresence, Variants } from 'framer-motion';

function TransactionPage() {
  const { mutate: deleteTransactions } = useDeleteTransactions();
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const toggleSelectedTransaction = (transactionId: number) => {
    let newArr = [];
    const index = selectedTransactionIds.indexOf(transactionId);
    if (index === -1) {
      newArr = [...selectedTransactionIds, transactionId];
    } else {
      newArr = selectedTransactionIds.filter(i => i !== transactionId);
    }
    setSelectedTransactionIds(newArr);
  };
  return (
    <TransactionPageContext.Provider value={{ selectedTransactionIds, toggleSelectedTransaction }}>
      <Layout>
        <Nav />
        <Main>
          <Left>
            <TabSidebar />
          </Left>
          <Center>
            <Transactions />
          </Center>
          <Right>
            <TransactionActionWrapper>
              {selectedTransactionIds.length === 0 && (
                <ButtonWrapper>
                  <Link passHref href="/import">
                    <Button category="NEUTRAL" outline small>
                      Add From Bank
                    </Button>
                  </Link>

                  <Link passHref href="/transactions/new">
                    <Button category="NEUTRAL" outline small>
                      Manual Transaction
                    </Button>
                  </Link>
                </ButtonWrapper>
              )}
              <AnimatePresence>
                {selectedTransactionIds.length === 1 && (
                  <ActionSidebar
                    initial="closed"
                    animate={selectedTransactionIds.length === 1 ? 'open' : 'closed'}
                    variants={variants}
                    exit="closed"
                  >
                    <EditTransaction
                      transactionId={selectedTransactionIds[0]}
                      cancelEdit={() => setSelectedTransactionIds([])}
                    />
                  </ActionSidebar>
                )}
              </AnimatePresence>
              {selectedTransactionIds.length > 1 && (
                <ButtonWrapper>
                  <Button
                    category="DANGER"
                    onClick={() => {
                      deleteTransactions(
                        { transactionIds: selectedTransactionIds },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries('fetch-transactions');
                            setSelectedTransactionIds([]);
                          },
                        }
                      );
                    }}
                  >
                    Delete Selected
                  </Button>
                </ButtonWrapper>
              )}
            </TransactionActionWrapper>
          </Right>
        </Main>
      </Layout>
    </TransactionPageContext.Provider>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
}

const TransactionActionWrapper = styled.div`
  padding: 1rem;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media only screen and (max-width: ${smBreakpoint}) {
    flex-direction: row;
    justify-content: center;
  }
`;

const variants: Variants = {
  open: { x: 0, transition: { type: 'just' }, opacity: 1 },
  closed: { x: '+100%', opacity: 0 },
};
export default TransactionPage;
