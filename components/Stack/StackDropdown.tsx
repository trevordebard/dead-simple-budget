import { Dropdown, DropdownBody, DropdownHeader, DropdownItem } from 'components/Shared/Dropdown';
import { ListRow } from 'components/Styled';
import { useStacks } from 'lib/hooks';
import { centsToDollars } from 'lib/money';

interface iStackDropdown {
  defaultStack: string;
  inline?: boolean;
  onSelect?: (value: string) => void;
}
export function StackDropdown({ defaultStack, onSelect, inline = false }: iStackDropdown) {
  return (
    <Dropdown onSelect={onSelect}>
      <DropdownHeader inline={inline} defaultValue={defaultStack} />
      <DropdownBody>
        <StackDropdownItems />
      </DropdownBody>
    </Dropdown>
  );
}

function StackDropdownItems() {
  const { data: stacks, isLoading } = useStacks();
  if (!stacks || isLoading) {
    return null;
  }
  return (
    <div>
      {stacks.map(stack => {
        return (
          <DropdownItem key={stack.id} value={stack.label}>
            <ListRow selected={false}>
              <div>{stack.label}</div>
              <div>{centsToDollars(stack.amount)}</div>
            </ListRow>
          </DropdownItem>
        );
      })}
    </div>
  );
}
