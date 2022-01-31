import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

const temp = [
  {
    id: '1',
    label: 'Miscellaneous',
    stackOrder: [],
    budgetId: 'ckyweyi6v0043m2w2rs3s839w',
    items: [
      {
        id: '3',
        label: 'abc',
        stackCategoryId: '1',
        amount: 100000,
        created_at: '2022-01-30T01:54:01.419Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
      {
        id: '2',
        label: 'Travel',
        stackCategoryId: '1',
        amount: 296700,
        created_at: '2022-01-27T03:25:44.583Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
      {
        id: '4',
        label: 'blah',
        stackCategoryId: '1',
        amount: 110000,
        created_at: '2022-01-30T02:07:29.096Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
      {
        id: 'ckz21lpnj0021zow27ex5me1z',
        label: 'test',
        stackCategoryId: '1',
        amount: 0,
        created_at: '2022-01-31T01:58:08.671Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
    ],
  },
  {
    id: '2',
    label: 'Necessities',
    stackOrder: [],
    budgetId: 'ckyweyi6v0043m2w2rs3s839w',
    items: [
      {
        id: '1',
        label: 'Rent',
        stackCategoryId: '2',
        amount: 0,
        created_at: '2022-01-27T03:25:33.391Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
    ],
  },
];

const itemsFromBackend = [
  { id: uuid(), content: 'First task' },
  { id: uuid(), content: 'Second task' },
  { id: uuid(), content: 'Third task' },
  { id: uuid(), content: 'Fourth task' },
  { id: uuid(), content: 'Fifth task' },
];

const columnsFromBackend = {
  a: {
    id: '1',
    label: 'Miscellaneous',
    stackOrder: [],
    budgetId: 'ckyweyi6v0043m2w2rs3s839w',
    items: [
      {
        id: '3',
        label: 'abc',
        stackCategoryId: 1,
        amount: 100000,
        created_at: '2022-01-30T01:54:01.419Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
      {
        id: '2',
        label: 'Travel',
        stackCategoryId: 1,
        amount: 296700,
        created_at: '2022-01-27T03:25:44.583Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
      {
        id: '4',
        label: 'blah',
        stackCategoryId: 1,
        amount: 110000,
        created_at: '2022-01-30T02:07:29.096Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
    ],
  },
  b: {
    id: '2',
    label: 'Necessities',
    stackOrder: [],
    budgetId: 'ckyweyi6v0043m2w2rs3s839w',
    items: [
      {
        id: '1',
        label: 'Rent',
        stackCategoryId: 2,
        amount: 0,
        created_at: '2022-01-27T03:25:33.391Z',
        budgetId: 'ckyweyi6v0043m2w2rs3s839w',
      },
    ],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState({ ...temp });
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);
  if (!winReady) {
    return <div>loading..</div>;
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
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
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.label}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
