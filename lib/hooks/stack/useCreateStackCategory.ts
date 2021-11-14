import { StackCategory } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';
import { useMutation } from 'react-query';
import { iCreateStackCategoryInput } from 'types/stack';

export function useCreateStackCategory() {
  const { addAlert } = useAlert();

  return useMutation(createStackCategory, {
    onError: () => {
      addAlert({ message: 'There was a problem adding category', type: 'error' });
    },
  });
}

async function createStackCategory(stackCat: iCreateStackCategoryInput) {
  const response = await axios.post<StackCategory>(`/api/stacks/categories`, stackCat);
  return response.data;
}
