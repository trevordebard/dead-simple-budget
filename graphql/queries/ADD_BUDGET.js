import { gql } from '@apollo/client';

export const ADD_BUDGET = gql`
  mutation ADD_BUDGET($email: String!) {
    createOnebudget(data: { user: { connect: { email: $email } }, total: 0, toBeBudgeted: 0 }) {
      total
      id
    }
  }
`;
