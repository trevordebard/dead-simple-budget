import { gql } from '@apollo/client';

export const DELETE_MANY_TRANSACTIONS = gql`
  mutation deleteManyTransactions($transactionIds: [Int!]) {
    deleteManytransactions(where: { id: { in: $transactionIds } }) {
      count
    }
  }
`;
