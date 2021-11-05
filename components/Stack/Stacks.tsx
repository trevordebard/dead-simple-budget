import { useContext, useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { BudgetContext } from 'pages/budget';
import { Stack } from '.prisma/client';
import { DraggableStackItem } from './StackItem';

const DraggableStacks = ({ stacks: data }) => {
  const budgetContext = useContext(BudgetContext);
  const [stacks, setStacks] = useState<Stack[]>(data);

  useEffect(() => {
    setStacks(data);
  }, [data, setStacks]);

  if (!stacks) {
    return <p>loading</p>;
  }

  return (
    <Reorder.Group
      axis="y"
      values={stacks}
      onReorder={newOrder => {
        budgetContext.setStackInFocus(null);
        setStacks(newOrder);
      }}
    >
      {stacks.map(item => (
        <DraggableStackItem key={item.id} item={item} />
      ))}
    </Reorder.Group>
  );
};

export { DraggableStacks };
