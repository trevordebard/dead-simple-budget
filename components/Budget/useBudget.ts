import { useSession } from 'next-auth/client';
import { GET_USER } from 'components/GET_USER';
import {
  useAddStackMutation,
  useGetUserQuery,
  useUpdateStackMutation,
  useUpdateTotalMutation,
} from 'graphql/generated/codegen';

const useBudget = () => {
  const [session] = useSession();
  const { data, loading, error } = useGetUserQuery({ variables: { email: session.user.email } });
  let budget;
  if (data?.user?.budget) {
    budget = data.user.budget;
  }

  const [addStack] = useAddStackMutation({
    update(cache, { data: result }) {
      const existingUser = cache.readQuery({
        query: GET_USER,
        variables: {
          email: session.user.email,
        },
      });
      const newUser = JSON.parse(JSON.stringify(existingUser));
      newUser.user.budget.stacks = [...newUser.user.budget.stacks, result.createOnestacks];
      cache.writeQuery({
        query: GET_USER,
        data: newUser,
      });
    },
  });

  const [updateStack] = useUpdateStackMutation({
    refetchQueries: ['getUser', 'getStack'],
  });
  const [updateTotal] = useUpdateTotalMutation({ refetchQueries: ['getUser'] });

  return { loading, data: budget, error, addStack, updateStack, updateTotal };
};

export default useBudget;
