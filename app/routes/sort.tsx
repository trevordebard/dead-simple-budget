import { Prisma, Stack } from '@prisma/client';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, resetServerContext, DropResult } from 'react-beautiful-dnd';
import { json, Link, LoaderFunction, useFetcher, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import { centsToDollars } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

type CategoryWithStack = Prisma.StackCategoryGetPayload<{ include: { Stack: true } }>;

const onDragEnd = (result: DropResult, columns: CategoryWithStack[], setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[parseInt(source.droppableId)];
    const destColumn = columns[parseInt(destination.droppableId)];
    const sourceStacks = [...sourceColumn.Stack];
    const destStacks = [...destColumn.Stack];
    const [removed] = sourceStacks.splice(source.index, 1);
    console.log(removed);
    destStacks.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        Stack: sourceStacks,
      },
      [destination.droppableId]: {
        ...destColumn,
        Stack: destStacks,
      },
    });
  } else {
    const column = columns[parseInt(source.droppableId)];
    const copiedStacks = [...column.Stack];
    console.log(copiedStacks);
    const [removed] = copiedStacks.splice(source.index, 1);
    copiedStacks.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        Stack: copiedStacks,
      },
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // Allow server rendering of drag and drop components
  resetServerContext();
  const user = await requireAuthenticatedUser(request);

  const categorized = await db.stackCategory.findMany({
    where: { budget: { user: { id: user.id } } },
    include: { Stack: true },
  });
  console.log('loadercalled');
  return json(categorized);
  // return null;
};

function App() {
  const categorized = useLoaderData();
  const [columns, setColumns] = useState<CategoryWithStack[]>({ ...categorized });

  useEffect(() => {
    setColumns({ ...categorized });
  }, [categorized]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              key={columnId}
            >
              <h2>{column.label}</h2>
              <div style={{ margin: 8 }}>
                <DroppableList droppableId={columnId} key={columnId}>
                  {column.Stack.map((item, index) => {
                    return (
                      <DraggableItem id={item.id} index={index} key={item.id}>
                        <EditableStack stack={item} />
                      </DraggableItem>
                    );
                  })}
                </DroppableList>
              </div>
            </div>
          );
        })}
      </DragDropContext>
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
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              // background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
              padding: 4,
              width: 250,
              minHeight: 500,
            }}
          >
            {provided.placeholder}
            {children}
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
