import { useAlert } from 'components/Alert';
import { useMutation, useQueryClient } from 'react-query';
import { Stack, StackCategory } from '.prisma/client';
import axios from 'axios';
import { iCreateStackInput } from 'types/stack';

export function useCreateStack() {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();
  return useMutation('create-stack-category', createStack, {
    onSuccess: () => queryClient.invalidateQueries('fetch-stacks-by-category'),
    onError: e => {
      addAlert({ message: 'There was a problem adding stack', type: 'error' });
    },
  });
}

async function createStack(stack: iCreateStackInput) {
  const response = await axios.post<StackCategory>(`/api/stack`, stack);
  return response;
}

export { createStack };
