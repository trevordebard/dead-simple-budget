import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries/GET_ME';

const UPDATE_STACK = gql`
  mutation($budgetId: Int!, $label: String!, $amount: Float!) {
    updateOnestacks(
      data: { amount: { set: $amount } }
      where: { budgetId_label_idx: { budgetId: $budgetId, label: $label } }
    ) {
      label
      amount
    }
  }
`;

const UPDATE_TOTAL = gql`
  mutation($budgetId: Int!, $total: Float!) {
    updateOnebudget(data: { total: { set: $total } }, where: { id: $budgetId }) {
      total
    }
  }
`;

const ADD_STACK = gql`
  mutation($budgetId: Int!, $newStackLabel: String!) {
    createOnestacks(data: { label: $newStackLabel, budget: { connect: { id: $budgetId } } }) {
      label
      amount
      id
      budgetId
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
    }
  }
`;

const useBudget = () => {
  const { data, loading, error } = useQuery(GET_BUDGET, { fetchPolicy: 'cache-only' });
  // TODO: Update stack label cache on addStack
  // For some reason GET_STACK_LABELS is not refetched on add stack, but it is on remove stack ???
  // Not looking deep into this since this will all be changed once I start working with cache more effectively
  const [addStack] = useMutation(ADD_STACK, {
    update(cache, { data: result }) {
      const existingBudget = cache.readQuery({
        query: GET_ME,
      });

      const newBudget = JSON.parse(JSON.stringify(existingBudget));
      newBudget.me.budget[0].stacks = [...newBudget.me.budget[0].stacks, result.createOnestacks];
      cache.writeQuery({
        query: GET_BUDGET,
        data: { me: newBudget.me },
      });
    },
  });
  const [updateStack] = useMutation(UPDATE_STACK);
  const [removeStack] = useMutation(REMOVE_STACK, { refetchQueries: ['GET_BUDGET', 'GET_STACK_LABELS'] });
  const [updateTotal] = useMutation(UPDATE_TOTAL);

  return { loading, data: data?.me.budget[0], error, addStack, updateStack, removeStack, updateTotal };
};

export default useBudget;
