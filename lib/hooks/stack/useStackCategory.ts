import { useQuery } from 'react-query';
import { StackCategory } from '.prisma/client';
import axios from 'axios';

export function useStackCategory(stackCatId: number) {
  return useQuery([`fetch-stack-category-${stackCatId}`, { stackCatId }], fetchStackCategory);
}

async function fetchStackCategory({ queryKey }) {
  const [_, { stackCatId }] = queryKey;
  const response = await axios.get<StackCategory>(`/api/stacks/categories/${stackCatId}`);
  return response.data;
}
