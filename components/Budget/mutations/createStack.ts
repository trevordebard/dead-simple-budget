import { Stack } from '.prisma/client';
import axios from 'axios';
import { iCreateStackInput } from 'types/stack';

async function createStack(stack: iCreateStackInput) {
  const response = await axios.post<Stack>(`/api/stack`, stack);
  return response;
}

export { createStack };
