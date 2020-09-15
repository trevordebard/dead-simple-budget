import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      user {
        email
      }
    }
  }
`;
