import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Stack } from '.prisma/client';
import { DraggableStackItem } from './StackItem';
import { useCategorizedStacks } from 'lib/hooks/stack/useCategorizedStacks';
import { useUpdateStackCategory } from 'lib/hooks/stack/useUpdateStackCategory';

const CategorizedStacks = ({ stacks: data }) => {
  const { data: categorized, isLoading } = useCategorizedStacks();

  if (isLoading) {
    return <p>loading</p>;
  }
  return (
    <div>
      {categorized.map(stackCategory => {
        return (
          <StackCategory
            key={stackCategory.id}
            id={stackCategory.id}
            label={stackCategory.category}
            stacks={stackCategory.stacks}
          />
        );
      })}
    </div>
  );
};

export { CategorizedStacks };

interface iStackCategoryProps {
  id: number;
  label: string;
  stacks: Stack[];
}
function StackCategory({ label, stacks: defaultStacks, id }: iStackCategoryProps) {
  const { mutate: updateStackCategory } = useUpdateStackCategory();
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
          updateStackCategory({ id, stackOrder: newOrder.map(stack => stack.id) });
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
