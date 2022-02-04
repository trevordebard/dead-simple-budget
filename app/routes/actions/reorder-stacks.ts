import { ActionFunction, json } from 'remix';
import { db } from '~/utils/db.server';
import { CategoryReorderPayload } from '../sort';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const payload: CategoryReorderPayload = JSON.parse(String(formData.get('payload')));
  // const promises = [];

  await db.stack.update({
    where: { id: payload.updatedStack.id },
    data: { stackCategoryId: payload.updatedStack.stackCategoryId },
  });
  // payload.modifiedCategoryIds.forEach((catId) => {
  //   const incomingCategory = payload.categories.find((c) => c.id === catId);
  //   console.log(incomingCategory);
  //   incomingCategory?.Stack.forEach((s) => {
  //     promises.push(db.stack.update({ where: { id: s.id }, data: { stackCategoryId: s.stackCategoryId } }));
  //   });
  // });

  // try {
  //   // console.log(promises);
  //   const r = await Promise.all(promises);
  //   // console.log(r);
  // } catch (e) {
  //   console.log('err');
  // }

  // await db.stackCategory.updateMany({ data: columns, where: {}});

  return json({ success: true });
};
