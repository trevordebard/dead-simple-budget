import { gql } from '@apollo/client';

export const ADD_STACK = gql`
  mutation addStack($budgetId: Int!, $newStackLabel: String!) {
    createOneStack(data: { label: $newStackLabel, budget: { connect: { id: $budgetId } } }) {
      label
      amount
      id
      budgetId
    }
  }
`;
