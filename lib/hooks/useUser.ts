import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { User } from '.prisma/client';
import axios from 'axios';

export function useUser() {
  const { data: session } = useSession();

  return useQuery(['fetch-user-totals', { email: session.user.email }], fetchUserTotals, {
    enabled: !!session.user.email,
  });
}

// TODO: this should probably be renamed
async function fetchUserTotals({ queryKey }) {
  const [_, { email }] = queryKey;
  const response = await axios.get<User>(`/api/user/${email}`);
  return response.data;
}

export { fetchUserTotals };
