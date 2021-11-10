import { StackCategory } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';
import { useMutation } from 'react-query';
import { iUpdateStackCategoryInput } from 'types/stack';

export function useUpdateStackCategory() {
  const { addAlert } = useAlert();

  return useMutation(updateStackCategory, {
    onError: () => {
      addAlert({ message: 'There was a problem editing transaction', type: 'error' });
    },
  });
}

async function updateStackCategory(stackCat: iUpdateStackCategoryInput) {
  const response = await axios.put<StackCategory>(`/api/stacks/categories/${stackCat.id}`, stackCat);
  return response.data;
}
