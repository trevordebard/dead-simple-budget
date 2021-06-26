//TODO: refactor into useTotals and useStacks hooks
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { useAlert } from 'components/Alert';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchStacks } from './queries/getStacks';
import { Stack } from '.prisma/client';
import { updateStack as updateStackMutation } from './mutations/updateStack';
import { createStack as createStackMutation } from './mutations/createStack';
import { deleteStack as deleteStackMutation } from './mutations/deleteStack';
import { updateUserTotal as updateUserTotalMutation } from './mutations/updateUserTotal';
import { fetchUserTotals } from './queries/getUserTotals';

interface iBudgetTotals {
  total: number;
  toBeBudgeted: number;
}

const useBudget = () => {
  const queryClient = useQueryClient();
  const [stacks, setStacks] = useState<Stack[]>();
  const [session] = useSession();
  const [userTotals, setUserTotals] = useState<iBudgetTotals>({ toBeBudgeted: 0, total: 0 });
  const { data: fetchStacksResponse, error, isLoading } = useQuery('fetch-stacks', fetchStacks);
  const { data: fetchUserTotalsResp, error: fetchBudgetError } = useQuery(
    ['fetch-user-totals', { email: session.user.email }],
    fetchUserTotals,
    { enabled: !!session.user.email }
  );
  const { mutate: updateStack } = useMutation('update-stack', updateStackMutation);
  const { mutate: createStack } = useMutation('update-stack', createStackMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-stacks');
    },
    onError: e => {
      addAlert({ message: 'There was a problem adding stack', type: 'error' });
    },
  });
  const { mutate: deleteStack } = useMutation('update-stack', deleteStackMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-stacks');
    },
    onError: e => {
      addAlert({ message: 'There was a problem deleting stack', type: 'error' });
    },
  });
  const { mutate: updateUserTotal } = useMutation('update-totals', updateUserTotalMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-user-totals');
    },
    onError: () => {
      addAlert({ message: 'There was a problem updating total', type: 'error' });
    },
  });
  const { addAlert } = useAlert();
  useEffect(() => {
    if (fetchStacksResponse) {
      setStacks(fetchStacksResponse.data);
    }
  }, [stacks, fetchStacksResponse]);
  useEffect(() => {
    if (fetchUserTotalsResp) {
      const { total, toBeBudgeted } = fetchUserTotalsResp.data;
      console.log(total);
      setUserTotals({ total, toBeBudgeted });
    }
  }, [fetchUserTotalsResp]);

  return {
    loading: isLoading,
    userTotals,
    stacks: fetchStacksResponse?.data,
    error,
    createStack,
    updateStack,
    updateUserTotal,
    deleteStack,
  };
};

export default useBudget;
