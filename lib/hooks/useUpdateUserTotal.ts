import { Stack } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';
import { useMutation, useQueryClient } from 'react-query';

export function useUpdateUserTotal() {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  return useMutation('update-totals', updateUserTotal, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-user-totals');
    },
    onError: () => {
      addAlert({ message: 'There was a problem updating total', type: 'error' });
    },
  });
}

async function updateUserTotal({ email, total }: { email: string; total: number }) {
  const response = await axios.put<Stack[]>(`/api/user/${email}`, { total });
  return response;
}
