import { Stack } from '@prisma/client';
import { ActionFunction, json } from 'remix';
import { db } from '~/utils/db.server';
import { CategoryReorderPayload } from '../../components/categorized-stacks';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const payload: CategoryReorderPayload = JSON.parse(String(formData.get('payload')));
  const promises: Promise<Stack>[] = [];

  // Update the position and category of each stack in the categories that have been modified
  payload.modifiedCategoryIds.forEach((catId) => {
    const incomingCategory = payload.categories.find((c) => c.id === catId);
    // each stack must be updated since its position in the list has likely changed
    incomingCategory?.Stack.forEach((s) => {
      promises.push(
        db.stack.update({ where: { id: s.id }, data: { stackCategoryId: s.stackCategoryId, position: s.position } })
      );
    });
  });

  try {
    await Promise.all(promises);
    // console.log(r);
  } catch (e) {
    return json({ success: false }, 500);
  }

  return json({ success: true });
};
