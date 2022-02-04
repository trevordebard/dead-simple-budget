import { Prisma, Stack } from '@prisma/client';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, resetServerContext, DropResult } from 'react-beautiful-dnd';
import { json, Link, LoaderFunction, useFetcher, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import { centsToDollars } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

export type CategoryWithStack = Prisma.StackCategoryGetPayload<{ include: { Stack: true } }>;

export type CategoryReorderPayload = {
  categories: CategoryWithStack[];
  modifiedCategoryIds: string[];
};

function recalcStackPositions(stacks: Stack[]): Stack[] {
  return stacks.map((stack, index) => {
    return {
      ...stack,
      position: index * 10,
    };
  });
}
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

export const loader: LoaderFunction = async ({ request }) => {
  // Allow server rendering of drag and drop components
  resetServerContext();
  const user = await requireAuthenticatedUser(request);

  const categorized = await db.stackCategory.findMany({
    where: { budget: { user: { id: user.id } } },
    include: { Stack: true },
  });

  return json(categorized);
};

function App() {
  const categorized = useLoaderData<CategoryWithStack[]>();
  const [categorizedStacks, setCategorizedStacks] = useState<CategoryWithStack[]>(categorized);
  const fetcher = useFetcher();

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
          {categorizedStacks.map((c) => {
            return (
              <div key={c.id}>
                <h2>{c.label}</h2>
                <div>
                  <DroppableList droppableId={c.id} key={c.id}>
                    {c.Stack.sort((a, b) => a.position - b.position).map((stack, index) => (
                      <DraggableItem id={stack.id} index={index} key={stack.id}>
                        <EditableStack stack={stack} />
                      </DraggableItem>
                    ))}
                  </DroppableList>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;

function DraggableItem({ id, index, children }) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {children}
          </div>
        );
      }}
    </Draggable>
  );
}

function DroppableList({ children, droppableId }) {
  return (
    <Droppable droppableId={droppableId} key={droppableId}>
      {(provided, snapshot) => {
        return (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
}

function EditableStack({ stack }: { stack: Stack }) {
  const stackFetcher = useFetcher();
  return (
    <div key={stack.id} className="flex justify-between items-center ml-3 border-b ">
      <label htmlFor={stack.label}>{stack.label}</label>
      <div className="flex items-center space-x-3 py-2">
        <stackFetcher.Form method="post" action="/budget">
          <input type="hidden" name="_action" value="edit-stack" />
          <input
            type="text"
            name={stack.label}
            id={stack.id.toString()}
            defaultValue={centsToDollars(stack.amount)}
            className="text-right border-none max-w-xs w-32 hover:bg-gray-100 px-4"
            onBlur={(e) => stackFetcher.submit(e.currentTarget.form)}
          />
        </stackFetcher.Form>
        <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
          edit
        </Link>
      </div>
    </div>
  );
}
