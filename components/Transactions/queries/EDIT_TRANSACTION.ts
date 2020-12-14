import { gql } from '@apollo/client';

export const EDIT_TRANSACTION = gql`
  mutation editTransaction(
    $id: Int!
    $amount: Float
    $stack: String
    $description: String
    $date: DateTime
    $type: String
  ) {
    updateOneTransaction(
      where: { id: $id }
      data: {
        description: { set: $description }
        stack: { set: $stack }
        amount: { set: $amount }
        type: { set: $type }
        date: { set: $date }
      }
    ) {
      id
      amount
      stack
      description
      date
    }
  }
`;
