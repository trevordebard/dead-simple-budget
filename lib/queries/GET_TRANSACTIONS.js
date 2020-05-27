import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GET_TRANSACTIONS {
    me {
      transactions {
        _id
        _userId
        stack
        amount
        description
      }
    }
  }
`;
