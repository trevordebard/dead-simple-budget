import { useQuery } from 'react-query';
import axios from 'axios';
import { iCategorizedStack, iGetStacksOptions } from 'types/stack';

function useCategorizedStacks() {
  return useQuery('fetch-stacks-by-category', fetchStacksByCategory, { staleTime: 20000 });
}

export async function fetchStacksByCategory(headers = null) {
  const options: iGetStacksOptions = { organizeBy: 'category' };
  const response = await axios.get<iCategorizedStack[]>(
    `${process.env.NEXTAUTH_URL}/api/stacks?organizeBy=${options.organizeBy}`,
    { headers }
  );
  return response.data;
}

export { useCategorizedStacks };
