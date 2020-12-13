import { gql } from '@apollo/client';

export const GET_BUDGET = gql`
  query getBudget($email: String!) {
    budgets(where: { user: { email: { equals: $email } } }) {
      id
      userId
      total
      toBeBudgeted
      stacks(orderBy: { created_at: asc }) {
        id
        label
        amount
        created_at
        budgetId
      }
    }
  }
`;
