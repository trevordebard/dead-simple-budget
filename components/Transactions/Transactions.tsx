import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import useTransactions from './useTransactions';
import { smBreakpoint } from '../../lib/constants';
import { Table, THead, TR, TD, TH } from 'components/Styled/Table'

const TransactionWrapper = styled.div`
  max-width: 100%;
`;

const Title = styled.div`
  text-align: center;
`;

const TableWrapper = styled.div`
  max-height: 600px;
  font-size: 13px;
  overflow-y: scroll;
  
  @media only screen and (max-width: ${smBreakpoint}) {
  max-width: 90vw;
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
