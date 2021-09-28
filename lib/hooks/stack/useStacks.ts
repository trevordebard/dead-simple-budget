import { useQuery } from 'react-query';
import { Stack } from '.prisma/client';
import axios from 'axios';

export function useStacks() {
  return useQuery('fetch-stacks', fetchStacks);
}

async function fetchStacks() {
  const response = await axios.get<Stack[]>('/api/stacks');
  return response.data;
}

export { fetchStacks };
