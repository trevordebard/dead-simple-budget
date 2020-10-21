import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GET_USER($email: String!) {
    user(where: { email: $email }) {
      id
      email
      budget {
        id
        total
        toBeBudgeted
        stacks {
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
