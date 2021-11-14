import { useMutation, useQueryClient } from 'react-query';
import { Stack } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';

export function useDeleteStackCategory() {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();
  return useMutation('delete-stack-category', deleteStackCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-stacks-by-category');
    },
    onError: e => {
      addAlert({ message: 'There was a problem deleting stack', type: 'error' });
    },
  });
}

async function deleteStackCategory({ stackCategoryId }: { stackCategoryId: number }) {
  const response = await axios.delete<Stack>(`/api/stacks/categories/${stackCategoryId}`);
  return response;
}
