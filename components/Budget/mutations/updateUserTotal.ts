import { Stack } from '.prisma/client';
import axios from 'axios';

async function updateUserTotal({ email, total }: { email: string; total: number }) {
  const response = await axios.put<Stack[]>(`/api/user/${email}`, { total });
  return response;
}

export { updateUserTotal };
