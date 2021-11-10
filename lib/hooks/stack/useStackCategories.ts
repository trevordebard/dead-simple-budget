import { useQuery } from 'react-query';
import { StackCategory } from '.prisma/client';
import axios from 'axios';

export function useStackCategories() {
  return useQuery('fetch-stack-categories', fetchStackCategories);
}

async function fetchStackCategories() {
  const response = await axios.get<StackCategory[]>('/api/stacks/categories');
  return response.data;
}
