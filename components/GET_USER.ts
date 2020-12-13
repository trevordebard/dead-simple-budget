import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($email: String!) {
    user(where: { email: $email }) {
      id
      email
      budget {
        id
        total
        toBeBudgeted
        stacks(orderBy: { created_at: asc }) {
          id
          label
          amount
        }
      }
      transactions {
        description
        date
        id
        amount
        stack
        type
      }
    }
  }
`;
