import { gql, useQuery, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { GET_USER } from 'graphql/queries/GET_USER';

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

const useBudget = () => {
  const [session] = useSession();
  const { data, loading, error } = useQuery(GET_USER, { variables: { email: session.user.email } });

  let budget;
  if (data?.user?.budget) {
    // destructure array to get first budget
    // Right now users can only have 1 budget, but I could see a future where you can have multiple
    [budget] = data.user.budget;
  }

  const [addStack] = useMutation(ADD_STACK, {
    update(cache, { data: result }) {
      const existingUser = cache.readQuery({
        query: GET_USER,
        variables: {
          email: session.user.email,
        },
      });
      const newUser = JSON.parse(JSON.stringify(existingUser));
      newUser.user.budget[0].stacks = [...newUser.user.budget[0].stacks, result.createOnestacks];
      cache.writeQuery({
        query: GET_USER,
        data: newUser,
      });
    },
  });

  const [updateStack] = useMutation(UPDATE_STACK, {
    refetchQueries: ['GET_USER'],
  });
  const [updateTotal] = useMutation(UPDATE_TOTAL, { refetchQueries: ['GET_USER'] });

  return { loading, data: budget, error, addStack, updateStack, updateTotal };
};

export default useBudget;
