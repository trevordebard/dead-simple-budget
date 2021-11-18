import { useQuery } from 'react-query';
import axios from 'axios';
import { iCategorizedStack, iGetStacksOptions } from 'types/stack';

function useCategorizedStacks() {
  return useQuery('fetch-stacks-by-category', fetchStacksByCategory);
}

async function fetchStacksByCategory() {
  const options: iGetStacksOptions = { organizeBy: 'category' };
  const response = await axios.get<iCategorizedStack[]>(`/api/stacks?organizeBy=${options.organizeBy}`);
  return response.data;
}

export { useCategorizedStacks };
