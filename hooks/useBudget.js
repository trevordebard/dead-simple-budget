import { gql, useQuery, useMutation } from '@apollo/client';

const UPDATE_STACK = gql`
  mutation($budgetId: MongoID!, $label: String!, $value: Float!) {
    budgetUpdateStack(budgetId: $budgetId, label: $label, value: $value) {
      total
      toBeBudgeted
      stacks {
        value
        label
      }
    }
  }
`;
const ADD_STACK = gql`
  mutation($budgetId: MongoID!, $newStackLabel: String!, $newStackValue: Float) {
    budgetPushToStacks(budgetId: $budgetId, newStackLabel: $newStackLabel, newStackValue: $newStackValue) {
      total
      toBeBudgeted
      stacks {
        label
        value
      }
    }
  }
`;
const REMOVE_STACK = gql`
  mutation($budgetId: MongoID!, $label: String!) {
    budgetRemoveStack(budgetId: $budgetId, label: $label) {
      total
      toBeBudgeted
      stacks {
        label
        value
      }
    }
  }
`;
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
  // TODO: Update stack label cache on addStack
  // For some reason GET_STACK_LABELS is not refetched on add stack, but it is on remove stack ???
  // Not looking deep into this since this will all be changed once I start working with cache more effectively
  const [addStack] = useMutation(ADD_STACK, { refetchQueries: ['GET_BUDGET', 'GET_STACK_LABELS'] });
  const [updateStack] = useMutation(UPDATE_STACK, { refetchQueries: ['GET_BUDGET'] });
  const [removeStack] = useMutation(REMOVE_STACK, { refetchQueries: ['GET_BUDGET', 'GET_STACK_LABELS'] });

  return { loading, data: data?.me.budget, error, addStack, updateStack, removeStack };
};

export default useBudget;
