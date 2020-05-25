import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation($record: CreateOneUserInput!) {
    userCreateOne(record: $record) {
      record {
        email
        password
      }
    }
  }
`;
