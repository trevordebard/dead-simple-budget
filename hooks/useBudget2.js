import { gql, useQuery } from '@apollo/client';

const GET_BUDGET = gql`
  query GET_BUDGET {
    me {
      _id
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

const useBudget2 = () => {
  const { data, loading } = useQuery(GET_BUDGET);
  console.log(data);
  return { loading, data: data?.me.budget };
};

export default useBudget2;
