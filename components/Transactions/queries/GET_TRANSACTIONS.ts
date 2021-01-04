import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query getTransactions($email: String!) {
    transactions(where: { user: { email: { equals: $email } } }, orderBy: { date: desc }) {
      id
      amount
      description
      stack
      date
      type
    }
  }
`;
