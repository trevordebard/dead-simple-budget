import { useContext, useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { BudgetContext } from 'pages/budget';
import { Stack } from '.prisma/client';
import { DraggableStackItem } from './StackItem';
import { useCategorizedStacks } from 'lib/hooks/stack/useCategorizedStacks';

const CategorizedStacks = ({ stacks: data }) => {
  const { data: categorized, isLoading } = useCategorizedStacks();

  if (isLoading) {
    return <p>loading</p>;
  }
  return (
    <div>
      {categorized.map(stackCategory => {
        return <StackGroup key={stackCategory.id} label={stackCategory.category} stacks={stackCategory.stacks} />;
      })}
    </div>
  );
};

export { CategorizedStacks };

interface iStackGroupProps {
  label: string;
  stacks: Stack[];
}
function StackGroup({ label, stacks: defaultStacks }: iStackGroupProps) {
  const budgetContext = useContext(BudgetContext);
  const [stacks, setStacks] = useState<Stack[]>(defaultStacks);

  useEffect(() => {
    setStacks(defaultStacks);
  }, [defaultStacks, setStacks]);

  if (!stacks) {
    return <p>loading</p>;
  }
  return (
    <div>
      <p>{label}</p>
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
    </div>
  );
}
