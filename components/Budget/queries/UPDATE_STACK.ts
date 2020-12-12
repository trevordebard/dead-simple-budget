import { gql } from '@apollo/client';

export const UPDATE_STACK = gql`
  mutation updateStack($budgetId: Int!, $label: String!, $amount: Float!) {
    updateOnestacks(
      data: { amount: { set: $amount } }
      where: { budgetId_label_idx: { budgetId: $budgetId, label: $label } }
    ) {
      label
      amount
    }
  }
`;
