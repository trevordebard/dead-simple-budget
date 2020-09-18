import { gql } from '@apollo/client'
export const GET_ME = gql`
  query GET_ME {
    me {
      id
      email
      budget {
        id
        userId
        total
        toBeBudgeted
        stacks {
          id
          label
          amount
        }
       
      }
      transactions {
        id
        stack
        amount
        description
        date
        type
      }
    }
  }
`;