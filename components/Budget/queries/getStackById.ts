import { Stack } from '.prisma/client';
import axios from 'axios';

async function fetchStackById({ queryKey }) {
  const [_, { stackId }] = queryKey;
  const response = await axios.get<Stack>(`/api/stack/${stackId}`);
  return response;
}

export { fetchStackById };
