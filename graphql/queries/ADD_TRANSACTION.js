import { gql } from '@apollo/client';

export const ADD_TRANSACTION = gql`
  mutation ADD_TRANSACTION(
    $description: String!
    $stack: String!
    $amount: Float!
    $type: String!
    $email: String!
    $date: DateTime!
  ) {
    createOnetransactions(
      data: {
        description: $description
        stack: $stack
        amount: $amount
        type: $type
        date: $date
        user: { connect: { email: $email } }
      }
    ) {
      id
      description
      amount
      stack
      type
      userId
      date
    }
  }
`;
