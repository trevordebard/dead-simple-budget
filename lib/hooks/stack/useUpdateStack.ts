import { useMutation, useQueryClient } from 'react-query';
import { Stack } from '.prisma/client';
import axios from 'axios';
import { iUpdateStackInput } from 'types/stack';

export function useUpdateStack() {
  const queryClient = useQueryClient();
  return useMutation('update-stack', updateStack, {
    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries(`fetch-stack-${variables.id}`);
    },
  });
}

async function updateStack(stack: iUpdateStackInput) {
  const response = await axios.put<Stack[]>(`/api/stack/${stack.id}`, stack);
  return response;
}

export { updateStack };
