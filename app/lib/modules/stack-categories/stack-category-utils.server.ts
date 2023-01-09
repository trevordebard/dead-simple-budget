import { StackCategory } from '@prisma/client';
import { db } from '~/lib/db.server';

// TODO: derive these types from the prsimamodel
interface DeleteStackCategoryInput {
  categoryId: string;
  budgetId: string;
}
export async function deleteStackCateogry({ categoryId, budgetId }: DeleteStackCategoryInput) {
  const misc = await db.stackCategory.findFirst({
    where: { label: 'Miscellaneous', budgetId },
  });
  if (!misc) {
    throw Error('Cannot delete stack category if Miscellaneous category does not exist');
  }
  if (misc.id === categoryId) {
    throw Error('Cannot delete miscellaneous stack category');
  }

  // Change stacks within stack category to be in miscellaneous category
  await db.stack.updateMany({ where: { stackCategoryId: categoryId }, data: { stackCategoryId: misc.id } });
  await db.stackCategory.delete({ where: { id: categoryId } });
}

type tCreateCategoryProps = {
  budgetId: StackCategory['budgetId'];
  label: StackCategory['label'];
};

export async function addCategory({ budgetId, label }: tCreateCategoryProps) {
  const newCategory = await db.stackCategory.create({ data: { label, budgetId } });
  return newCategory;
}
