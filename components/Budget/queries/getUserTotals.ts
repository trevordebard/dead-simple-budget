import { user } from '.prisma/client';
import axios from 'axios';

// TODO: this should probably be renamed
async function fetchUserTotals({ queryKey }) {
  const [_, { email }] = queryKey;
  const response = await axios.get<user>(`/api/user/${email}`);
  return response;
}

export { fetchUserTotals };
