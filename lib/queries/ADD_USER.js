import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation($record: CreateOneUserInput!) {
    signup(record: $record) {
      email
      password
    }
  }
`;
