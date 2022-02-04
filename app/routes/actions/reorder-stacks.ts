import { Stack } from '@prisma/client';
import { ActionFunction, json } from 'remix';
import { db } from '~/utils/db.server';
import { CategoryReorderPayload } from '../sort';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const payload: CategoryReorderPayload = JSON.parse(String(formData.get('payload')));
  const promises: Promise<Stack>[] = [];

  await db.stack.update({
    where: { id: payload.updatedStack.id },
    data: { stackCategoryId: payload.updatedStack.stackCategoryId },
  });

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

  // await db.stackCategory.updateMany({ data: columns, where: {}});

  return json({ success: true });
};
