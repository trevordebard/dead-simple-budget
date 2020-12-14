import { gql } from '@apollo/client';

export const DELETE_MANY_TRANSACTIONS = gql`
  mutation deleteManyTransaction($transactionIds: [Int!]) {
    deleteManyTransaction(where: { id: { in: $transactionIds } }) {
      count
    }
  }
`;
