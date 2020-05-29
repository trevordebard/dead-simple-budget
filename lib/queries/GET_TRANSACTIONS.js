import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GET_TRANSACTIONS {
    me {
      _id
      transactions {
        _id
        stack
        amount
        description
      }
    }
  }
`;
