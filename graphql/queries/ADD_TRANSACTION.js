import { gql } from '@apollo/client';

export const ADD_TRANSACTION = gql`
  mutation($record: CreateOneTransactionInput!) {
    transactionCreateOne(record: $record) {
      record {
        description
        date
        amount
        stack
      }
    }
  }
`;
