import { useSession } from 'next-auth/client';
import {
  Budget,
  useAddStackMutation,
  useGetBudgetQuery,
  useUpdateStackMutation,
  useUpdateTotalMutation,
} from 'graphql/generated/codegen';
import { useEffect, useState } from 'react';

const useBudget = () => {
  const [session] = useSession();
  const { data, loading, error } = useGetBudgetQuery({ variables: { email: session.user.email } });
  const [budget, setBudget] = useState<null | Budget>(null);
  useEffect(() => {
    if (data) {
      setBudget(data.budgets[0]);
    }
  }, [data]);

  const [addStack] = useAddStackMutation({
    refetchQueries: ['getBudget'],
  });

  const [updateStack] = useUpdateStackMutation({
    refetchQueries: ['getBudget', 'getStack'],
  });
  const [updateTotal] = useUpdateTotalMutation({ refetchQueries: ['getBudget'] });

  return { loading, budget, error, addStack, updateStack, updateTotal };
};

export default useBudget;
