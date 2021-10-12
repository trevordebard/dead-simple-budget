import { useMutation, useQueryClient } from 'react-query';
import { Stack } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';

export function useDeleteStack() {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();
  return useMutation('update-stack', deleteStack, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-stacks');
    },
    onError: e => {
      addAlert({ message: 'There was a problem deleting stack', type: 'error' });
    },
  });
}

async function deleteStack({ stackId }: { stackId: number }) {
  const response = await axios.delete<Stack>(`/api/stack/${stackId}`);
  return response;
}

export { deleteStack };
