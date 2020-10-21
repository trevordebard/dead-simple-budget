import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GET_TRANSACTIONS {
    me {
      id
      email
      transactions {
        id
        stack
        amount
        description
        date
        type
      }
    }
  }
`;
