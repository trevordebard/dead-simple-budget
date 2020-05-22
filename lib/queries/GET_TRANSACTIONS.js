import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GET_TRANSACTIONS {
    transactionMany(filter: { _userId: "5ec1d97edd768b5259f24b50" }) {
      _id
      _userId
      stack
      amount
      description
    }
  }
`;
