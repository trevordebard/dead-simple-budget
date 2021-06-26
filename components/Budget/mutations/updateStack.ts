import { Stack } from '.prisma/client';
import axios from 'axios';
import { iUpdateStackInput } from 'types/stack';

async function updateStack(stack: iUpdateStackInput) {
  const response = await axios.put<Stack[]>(`/api/stack/${stack.id}`, stack);
  return response;
}

export { updateStack };
