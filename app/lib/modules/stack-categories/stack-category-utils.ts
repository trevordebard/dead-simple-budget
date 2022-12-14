import { CategoryWithStack } from '~/lib/modules/stack-categories';

// This function can be used to optimistically generate a Stack Categories array when I new stack is created
export function createCategoriesOptimistically(
  categorized: CategoryWithStack[],
  formData: FormData
): CategoryWithStack[] {
  const action = String(formData.get('_action'));
  if (!action || action !== 'add-stack') {
    return categorized;
  }

  const newStack = String(formData.get('new-stack'));
  const categories = categorized.map((cat) => {
    if (cat.label === 'Miscellaneous') {
      const res: CategoryWithStack = {
        ...cat,
        Stack: [
          ...cat.Stack,
          {
            label: newStack,
            amount: 0,
            id: '-1',
            position: -1,
            budgetId: cat.budgetId,
            created_at: new Date(),
            stackCategoryId: cat.id,
          },
        ],
      };
      return res;
    }
    return { ...cat };
  });
  return categories;
}
