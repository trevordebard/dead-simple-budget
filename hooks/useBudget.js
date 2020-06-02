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

const useBudget = () => {
  const { data, loading, error } = useQuery(GET_BUDGET);

  return { loading, data: data?.me.budget, error };
};

export default useBudget;
