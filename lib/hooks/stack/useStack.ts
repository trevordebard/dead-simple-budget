import { useQuery } from 'react-query';
import { Stack } from '.prisma/client';
import axios from 'axios';

export function useStack(stackId: number) {
  const { data, isLoading, error } = useQuery([`fetch-stack-${stackId}`, { stackId }], fetchStackById);

  return {
    stack: data,
    isLoading,
    error,
  };
}

async function fetchStackById({ queryKey }) {
  const [_, { stackId }] = queryKey;
  const response = await axios.get<Stack>(`/api/stack/${stackId}`);
  return response.data;
}

export { fetchStackById };
