import { Stack } from '.prisma/client';
import axios from 'axios';

async function deleteStack({ stackId }: { stackId: number }) {
  const response = await axios.delete<Stack>(`/api/stack/${stackId}`);
  return response;
}

export { deleteStack };
