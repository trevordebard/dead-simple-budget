import { Stack } from '.prisma/client';
import axios from 'axios';

async function fetchStacks() {
  const response = await axios.get<Stack[]>('/api/stacks');
  return response;
}

export { fetchStacks };
