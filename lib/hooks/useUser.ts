import { useSession } from 'next-auth/client';
import { useQuery } from 'react-query';
import { user } from '.prisma/client';
import axios from 'axios';

export function useUser() {
  const [session] = useSession();

  return useQuery(['fetch-user-totals', { email: session.user.email }], fetchUserTotals, {
    enabled: !!session.user.email,
  });
}

// TODO: this should probably be renamed
async function fetchUserTotals({ queryKey }) {
  const [_, { email }] = queryKey;
  const response = await axios.get<user>(`/api/user/${email}`);
  return response.data;
}

export { fetchUserTotals };
