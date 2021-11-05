import { useAlert } from 'components/Alert';
import { Button, Input } from 'components/Styled';
import { useCreateStack } from 'lib/hooks';
import { useState } from 'react';

const NewStack = () => {
  const { addAlert } = useAlert();
  const { mutate: createStack } = useCreateStack();
  const [newStack, setNewStack] = useState<string>('');

  const handleAddStack = (stackName: string) => {
    if (!newStack || newStack.trim() === '') {
      addAlert({ message: 'Stack name cannot be empty.', type: 'error' });
    } else {
      createStack({ label: newStack });
      setNewStack('');
    }
  };
  return (
    <>
      <Input
        name="newStack"
        placeholder="Stack Name"
        autoComplete="off"
        value={newStack}
        onChange={e => setNewStack(e.target.value)}
      />
      <Button category="ACTION" name="addStack" onClick={() => handleAddStack(newStack)}>
        Add Stack
      </Button>
    </>
  );
};

export { NewStack };
