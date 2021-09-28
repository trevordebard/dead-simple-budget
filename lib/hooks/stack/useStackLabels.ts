import { getStackLabels } from 'lib/budgetUtils';
import { useEffect, useState } from 'react';
import { useStacks } from 'lib/hooks';

const useStackLabels = () => {
  const [stackLabels, setStackLabels] = useState<string[] | null>();

  const { data: stacks } = useStacks();

  useEffect(() => {
    if (stacks) {
      const labels = getStackLabels(stacks);
      setStackLabels(labels);
    }
  }, [stacks]);

  return {
    stackLabels,
  };
};

export default useStackLabels;
