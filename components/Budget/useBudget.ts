import { useSession } from 'next-auth/client';
import {
  Budget,
  useAddStackMutation,
  useGetBudgetQuery,
  useUpdateStackMutation,
  useUpdateTotalMutation,
} from 'graphql/generated/codegen';
import { useEffect, useState } from 'react';
import { useAlert } from 'components/Alert';

const useBudget = () => {
  const [session] = useSession();
  const { addAlert } = useAlert();
  const { data, loading, error } = useGetBudgetQuery({
    variables: { email: session.user.email },
  });
  const [budget, setBudget] = useState<null | Budget>(null);
  useEffect(() => {
    if (data) {
      setBudget(data.budgets[0]);
    }
  }, [data]);

  const [addStack] = useAddStackMutation({
    refetchQueries: ['getBudget'],
    onError: e => {
      let message = 'There was an error processing your request.';
      if (e.graphQLErrors.some(er => er.extensions?.exception?.code === 'P2002')) {
        message = 'A stack with that name already exists.';
      }
      addAlert({ message, type: 'error' });
    },
  });

  const [updateStack] = useUpdateStackMutation({
    refetchQueries: ['getBudget', 'getStack'],
  });
  const [updateTotal] = useUpdateTotalMutation({ refetchQueries: ['getBudget'] });

  return { loading, budget, error, addStack, updateStack, updateTotal };
};

export default useBudget;
