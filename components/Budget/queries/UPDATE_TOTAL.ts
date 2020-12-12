import { gql } from '@apollo/client';

export const UPDATE_TOTAL = gql`
  mutation updateTotal($budgetId: Int!, $total: Float!) {
    updateOnebudget(data: { total: { set: $total } }, where: { id: $budgetId }) {
      total
    }
  }
`;
