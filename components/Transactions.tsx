import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import useTransactions from '../hooks/useTransactions';
import { smBreakpoint } from '../lib/constants';
import { Table, THead, TR, TD, TH } from 'components/styled/Table'

const TransactionWrapper = styled.div`
  max-width: 100%;
  max-height: 70vh;
  display: grid;
  grid-template-columns: 3fr auto;
  grid-auto-rows: min-content;
  grid-template-areas:
    'title'
    'table';
`;

const Title = styled.div`
  grid-area: title;
  text-align: center;
`;

const TableWrapper = styled.div`
  grid-area: table;
  min-width: 450px;
  max-height: 600px;
  margin: 0 auto;
  font-size: 13px;
  overflow-y: scroll;

  @media only screen and (max-width: ${smBreakpoint}) {
    min-width: 350px;
    grid-template-columns: 1fr;
    max-height: 440px;
  }
`;

const Actions = styled.div`
  a + a::before {
    content: ' | ';
  }
`;
const ActionLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: var(--smallFontSize);
  cursor: pointer;
  color: var(--fontColorLight);
`;


const Transactions = () => {
  const { transactions, loading, deleteManyTransactions } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  if (!loading) {
    return (
      <TransactionWrapper>
        <Title>
          <h1>Transactions</h1>
          <Actions>
            {selectedTransactions.length === 0 && (
              <Link href="/transactions/new">
                <ActionLink>Add</ActionLink>
              </Link>
            )}
            {selectedTransactions.length === 1 && (
              <Link href={`/transactions/edit/${selectedTransactions[0]}`}>
                <ActionLink>Edit</ActionLink>
              </Link>
            )}
            {selectedTransactions.length > 0 && (
              <ActionLink
                role="button"
                onClick={() => {
                  deleteManyTransactions(selectedTransactions);
                  setSelectedTransactions([]);
                }}
              >
                Delete {selectedTransactions.length > 1 && 'Selected'}
              </ActionLink>
            )}
          </Actions>
        </Title>
        <TableWrapper>
          <Table cellSpacing="0" cellPadding="0" stickyHeader>
            <THead>
              <TR>
                <TH> </TH>
                <TH align="left">Description</TH>
                <TH align="right">Amount</TH>
                <TH align="right">Stack</TH>
                <TH style={{ minWidth: '115px' }} align="right">
                  Date
                </TH>
              </TR>
            </THead>
            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <TR key={transaction.id} selected={selectedTransactions.includes(transaction.id)}>
                    <TD>
                      <input
                        key={transaction.id}
                        type="checkbox"
                        onChange={e => {
                          if (!e.target.checked) {
                            setSelectedTransactions(selectedTransactions.filter(item => item !== transaction.id));
                          } else {
                            setSelectedTransactions([...selectedTransactions, transaction.id]);
                          }
                        }}
                      />
                    </TD>
                    <TD>{transaction.description}</TD>
                    <TD align="right">${transaction.amount}</TD>
                    <TD align="right">{transaction.stack}</TD>
                    <TD align="right">{new Date(transaction.date).toDateString() || '9999/9/9'}</TD>
                  </TR>
                ))}
            </tbody>
          </Table>
        </TableWrapper>
      </TransactionWrapper>
    );
  }
  return null;
};

export default Transactions;
