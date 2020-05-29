import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GET_TRANSACTIONS {
    me {
      _id
      transactions {
        stack
        amount
        description
      }
    }
  }
`;
