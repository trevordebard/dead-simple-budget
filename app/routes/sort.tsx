import { Prisma, Stack } from '@prisma/client';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, resetServerContext, DropResult } from 'react-beautiful-dnd';
import { json, Link, LoaderFunction, useFetcher, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import { centsToDollars } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

export type CategoryWithStack = Prisma.StackCategoryGetPayload<{ include: { Stack: true } }>;

export type CategoryReorderPayload = {
  categories?: CategoryWithStack[];
  modifiedCategoryIds?: string[];
  updatedStack: Stack;
};

const updateColumns = (
  result: DropResult,
  columns: CategoryWithStack[]
): { updatedStack?: Stack; newColumns: CategoryWithStack[] } => {
  if (!result.destination) return { newColumns: columns };
  const { source, destination } = result;
  const destColIndex = columns.findIndex((e) => e.id === destination.droppableId);
  const sourceColIndex = columns.findIndex((e) => e.id === source.droppableId);
  const columnsResult = [...columns];

  // If item is being dragged to new category
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[sourceColIndex];
    const destColumn = columns[destColIndex];
    const sourceStacks = [...sourceColumn.Stack];
    const destStacks = [...destColumn.Stack];

    // remove item from source column
    const [removed] = sourceStacks.splice(source.index, 1);

    removed.stackCategoryId = destColumn.id;

    // insert item in destination column
    destStacks.splice(destination.index, 0, removed);

    // Replace stacks in columns with new ordering
    columnsResult[sourceColIndex].Stack = sourceStacks;
    columnsResult[destColIndex].Stack = destStacks;

    return { newColumns: columnsResult, updatedStack: removed };
  }
  // If item being dragged will remain in the same category

  const column = columns[sourceColIndex];
  // Get stacks from the column in their original stack order (before dragging)
  const copiedStacks = [...column.Stack];
  // Remove the item that was dragged from the array
  const [removed] = copiedStacks.splice(source.index, 1);
  // Re-add the removed stack back into the array in its new location
  copiedStacks.splice(destination.index, 0, removed);

  // Replace stacks in column with new stack ordering
  columnsResult[destColIndex].Stack = copiedStacks;

  return { newColumns: columnsResult, updatedStack: removed };
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
  const [columns, setColumns] = useState<CategoryWithStack[]>(categorized);
  const fetcher = useFetcher();

  // useEffect(() => {
  //   setColumns(categorized);
  // }, [categorized]);

  return (
    <div>
      <div>
        <DragDropContext
          onDragEnd={(result) => {
            const { newColumns, updatedStack } = updateColumns(result, columns);
            if (!updatedStack) {
              throw Error('todo');
            }
            const modifiedCategoryIds = [result.source.droppableId];
            if (result.destination && result.destination.droppableId !== result.source.droppableId) {
              modifiedCategoryIds.push(result.destination.droppableId);
            }
            const payload: CategoryReorderPayload = { updatedStack };
            fetcher.submit({ payload: JSON.stringify(payload) }, { action: '/actions/reorder-stacks', method: 'post' });
            setColumns(newColumns);
          }}
        >
          {columns.map((c) => {
            return (
              <div key={c.id}>
                <h2>{c.label}</h2>
                <div>
                  <DroppableList droppableId={c.id} key={c.id}>
                    {c.Stack.map((stack, index) => (
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
