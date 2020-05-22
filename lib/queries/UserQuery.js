import { gql } from '@apollo/client';

export const UserQuery = gql`
  query user {
    userById(_id: "5ec1d97edd768b5259f24b50") {
      email
      _id
      transactions {
        _userId
        description
        amount
      }
      budget {
        _userId
        _id
        total
        toBeBudgeted
        stacks {
          _id
          label
          value
        }
      }
    }
  }
`;
