import { ReactElement } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

// Note: this abstraction may need to be updated in the future if snapshot is needed in child components

export function DraggableItem({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: ReactElement<HTMLElement>;
}) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {children}
          </div>
        );
      }}
    </Draggable>
  );
}
