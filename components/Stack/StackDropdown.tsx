import { DropdownBody, DropdownHeader, DropdownWrapper, ListRow } from 'components/Styled';
import { useStacks } from 'lib/hooks';
import { centsToDollars } from 'lib/money';
import { useState } from 'react';
import { Popover } from 'react-tiny-popover';

export const StackDropdown = ({ onCancel = null, onSelect, defaultStack, isDefaultOpened = false }) => {
  const { data: stacks } = useStacks();
  const [isOpen, setOpen] = useState(isDefaultOpened);
  const toggleDropdown = () => setOpen(!isOpen);
  const [selectedStack, setSelectedStack] = useState<string>(defaultStack);
  if (!stacks) {
    return null;
  }
  return (
    <Popover
      isOpen={isOpen}
      positions={['bottom', 'left']}
      onClickOutside={() => {
        setOpen(false);
        if (onCancel) {
          onCancel();
        }
      }}
      content={({ position, nudgedLeft, nudgedTop }) => (
        <DropdownBody>
          {stacks.map(stack => (
            <ListRow
              selected={selectedStack === stack.label}
              onClick={e => {
                setSelectedStack(stack.label);
                setOpen(false);
                onSelect(stack.label);
              }}
              key={stack.id}
              tabIndex={0}
            >
              <div>{stack.label}</div>
              <div>{centsToDollars(stack.amount)}</div>
            </ListRow>
          ))}
        </DropdownBody>
      )}
    >
      <DropdownWrapper>
        <DropdownHeader
          onClick={toggleDropdown}
          onKeyPress={e => {
            console.log(e.key);
            if (e.key === 'Enter') {
              toggleDropdown();
            }
          }}
          tabIndex={0}
        >
          {selectedStack}
        </DropdownHeader>
      </DropdownWrapper>
    </Popover>
  );
};
