import { useQuery, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { GET_USER } from 'components/GET_USER';
import { ADD_STACK, UPDATE_STACK, UPDATE_TOTAL } from './queries';

const useBudget = () => {
  const [session] = useSession();
  const { data, loading, error } = useQuery(GET_USER, { variables: { email: session.user.email } });

  let budget;
  if (data?.user?.budget) {
    budget = data.user.budget;
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
      newUser.user.budget.stacks = [...newUser.user.budget.stacks, result.createOnestacks];
      cache.writeQuery({
        query: GET_USER,
        data: newUser,
      });
    },
  });

  const [updateStack] = useMutation(UPDATE_STACK, {
    refetchQueries: ['GET_USER', 'GET_STACK'],
  });
  const [updateTotal] = useMutation(UPDATE_TOTAL, { refetchQueries: ['GET_USER'] });

  return { loading, data: budget, error, addStack, updateStack, updateTotal };
};

export default useBudget;
