import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useFetcher } from '@remix-run/react';
import { DraggableItem } from '~/components/beautiful-dnd-wrappers/draggable-item';
import { DroppableList } from '~/components/beautiful-dnd-wrappers/droppable-list';
import { EditableStack, recalcStackPositions } from '~/lib/modules/stacks';
import { tSpendingSummary } from '~/lib/modules/transactions';

export type CategoryWithStack = Prisma.StackCategoryGetPayload<{ include: { Stack: true } }>;

export type CategoryReorderPayload = {
  categories: CategoryWithStack[];
  modifiedCategoryIds: string[];
};

type HandleDragResult = {
  updatedCategories: CategoryWithStack[];
};

const handleStackDrag = (result: DropResult, categories: CategoryWithStack[]): HandleDragResult => {
  if (!result.destination) return { updatedCategories: categories };
  const { source, destination } = result;
  const destCatIndex = categories.findIndex((e) => e.id === destination.droppableId);
  const sourceCatIndex = categories.findIndex((e) => e.id === source.droppableId);
  const categoriesResult = [...categories];

  // If item is being dragged to new category
  if (source.droppableId !== destination.droppableId) {
    const sourceCategory = categories[sourceCatIndex];
    const destCategory = categories[destCatIndex];
    const sourceStacks = [...sourceCategory.Stack];
    const destStacks = [...destCategory.Stack];

    // remove item from source category
    const [removed] = sourceStacks.splice(source.index, 1);

    removed.stackCategoryId = destCategory.id;

    // insert item in destination category
    destStacks.splice(destination.index, 0, removed);

    // Replace stacks in category with new ordering
    categoriesResult[sourceCatIndex].Stack = sourceStacks;
    categoriesResult[destCatIndex].Stack = destStacks;

    // Reset positions for each stack in the category
    categoriesResult[sourceCatIndex].Stack = recalcStackPositions(categoriesResult[sourceCatIndex].Stack);
    categoriesResult[destCatIndex].Stack = recalcStackPositions(categoriesResult[destCatIndex].Stack);

    return { updatedCategories: categoriesResult };
  }

  // If item being dragged will remain in the same category

  const category = categories[sourceCatIndex];
  // Get stacks from the category in their original stack order (before dragging)
  const copiedStacks = [...category.Stack];
  // Remove the stack that was dragged from the array
  const [removed] = copiedStacks.splice(source.index, 1);
  // Re-add the removed stack back into the array in its new location
  copiedStacks.splice(destination.index, 0, removed);

  // Replace stacks in category with new stack ordering
  categoriesResult[destCatIndex].Stack = copiedStacks;

  // Reset positions for each stack in the category
  categoriesResult[destCatIndex].Stack = recalcStackPositions(categoriesResult[destCatIndex].Stack);

  return { updatedCategories: categoriesResult };
};

function CategorizedStacks({
  categorized,
  spendingSummary,
}: {
  categorized: CategoryWithStack[];
  spendingSummary: tSpendingSummary;
}) {
  const [categorizedStacks, setCategorizedStacks] = useState<CategoryWithStack[]>(categorized);
  const fetcher = useFetcher();

  useEffect(() => {
    setCategorizedStacks(categorized);
  }, [categorized]);

  return (
    <div>
      <div>
        <DragDropContext
          onDragEnd={(result) => {
            const { updatedCategories } = handleStackDrag(result, categorizedStacks);
            const modifiedCategoryIds = [result.source.droppableId];
            if (result.destination && result.destination.droppableId !== result.source.droppableId) {
              modifiedCategoryIds.push(result.destination.droppableId);
            }
            const payload: CategoryReorderPayload = { modifiedCategoryIds, categories: updatedCategories };
            fetcher.submit({ payload: JSON.stringify(payload) }, { action: '/actions/reorder-stacks', method: 'post' });
            setCategorizedStacks(updatedCategories);
          }}
        >
          <div className="flex flex-col space-y-4">
            {categorizedStacks.map((c, i) => {
              if (c.label !== 'Hidden') {
                return (
                  <div key={c.id}>
                    <div className="flex justify-between">
                      <h2 className="font-bold">{c.label}</h2>
                      {i === 0 ? (
                        <div className="flex space-x-2">
                          <div className="w-24 text-right">Allocated</div>
                          <div className="w-24 font-bold text-right px-2">Available</div>
                          <div className="w-4" />
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <DroppableList droppableId={c.id} key={c.id}>
                        {c.Stack.sort((a, b) => a.position - b.position).map((stack, index) => (
                          <DraggableItem id={stack.id} index={index} key={stack.id}>
                            <EditableStack
                              stack={stack}
                              totalSpent={spendingSummary.find((s) => s.stackId === stack.id)?._sum.amount ?? 0}
                            />
                          </DraggableItem>
                        ))}
                      </DroppableList>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export { CategorizedStacks };
