import { gql } from '@apollo/client';

export const ADD_BUDGET = gql`
  mutation addBudget($email: String!) {
    createOneBudget(data: { user: { connect: { email: $email } }, total: 0, toBeBudgeted: 0 }) {
      total
      id
    }
  }
`;
