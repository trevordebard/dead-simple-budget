import { ReactElement } from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

// Note: this abstraction may need to be updated in the future if snapshot is needed in child components

export function DroppableList({
  children,
  droppableId,
}: {
  children: ReactElement<HTMLElement>[];
  droppableId: string;
}) {
  return (
    <Droppable droppableId={droppableId} key={droppableId}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
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
