import ClickAwayListener from 'components/Shared/ClickAway';
import { createContext, ReactNode, useContext, useState } from 'react';
import styled, { css } from 'styled-components';

/**
 * This dropdown component follows the Compound Component React pattern.
 * This pattern was used to make a composable, flexible dropdown component that
 * still is able to control most of the repeatable state change logic.
 */

// Setup dropdown context
interface iDropdownContext {
  selectedItem: string;
  isOpen: boolean;
  toggleIsOpen: () => void;
  onItemSelected: (value: string) => void;
}

const defaultContext: iDropdownContext = {
  selectedItem: '',
  isOpen: false,
  toggleIsOpen: () => null,
  onItemSelected: val => null,
};
const DropdownContext = createContext(defaultContext);
DropdownContext.displayName = 'SelectorContext';

function useSelectContext() {
  return useContext(DropdownContext);
}

// function ExampleDropdownUsage() {
//   return (
//     <div>
//       <Dropdown>
//         <DropdownHeader inline defaultValue="Please Select an Item" />
//         <DropdownBody>
//           <DropdownItem value="Example item 1">
//             <p>Example item 1</p>
//           </DropdownItem>
//           <DropdownItem value="abc123">
//             <p>Click me and see what appears</p>
//           </DropdownItem>
//         </DropdownBody>
//       </Dropdown>
//     </div>
//   );
// }

interface iDropdown {
  isOpen?: boolean; // whether dropdown should be open
  children: ReactNode;
  onSelect?: (value: string) => void;
}

export function Dropdown({ children, isOpen: isOpenDefault = false, onSelect }: iDropdown) {
  const [selectedItem, setSelectedItem] = useState('');
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const onItemSelected = (value: string) => {
    setSelectedItem(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <DropdownContext.Provider value={{ selectedItem, isOpen, toggleIsOpen, onItemSelected }}>
      <DropdownWrapper>{children}</DropdownWrapper>
    </DropdownContext.Provider>
  );
}

interface iDropdownHeader {
  inline?: boolean;
  defaultValue: string;
}

// This is what will be visible on the screen always.
// When the header is clicked, the dropdown will appear
export function DropdownHeader({ inline = false, defaultValue }: iDropdownHeader) {
  const { toggleIsOpen, selectedItem } = useSelectContext();
  return (
    <SelectHeaderWrapper
      inline={inline}
      onClick={e => {
        // Prevent unintentional side effects such as onClick of a wrapper component being fired when the dropdown is clicked
        e.stopPropagation();
        toggleIsOpen();
      }}
    >
      {selectedItem ? selectedItem : defaultValue}
    </SelectHeaderWrapper>
  );
}

interface iDropdownBody {
  children: ReactNode;
}
// This component will appear when the dropdown header is clicked
export function DropdownBody({ children }: iDropdownBody) {
  const { isOpen, toggleIsOpen } = useSelectContext();
  if (!isOpen) {
    return null;
  }
  return (
    <ClickAwayListener onClickAway={toggleIsOpen}>
      <DropdownBodyWrapper>{children}</DropdownBodyWrapper>
    </ClickAwayListener>
  );
}

interface iDropdownItem {
  value: string; // the value to be stored if item is selected
  children?: ReactNode;
}
// All selectable items in the dropdown body should be wrapped in this component
export function DropdownItem({ children, value }: iDropdownItem) {
  const { isOpen, toggleIsOpen, onItemSelected } = useSelectContext();
  if (!isOpen) {
    return null;
  }
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        onItemSelected(value);
        toggleIsOpen();
      }}
    >
      {children}
    </div>
  );
}

const DropdownWrapper = styled.div`
  position: relative;
`;

const SelectHeaderWrapper = styled.div<{ inline: boolean }>`
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid var(--grey-800);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  ${({ inline }) =>
    inline &&
    css`
      border: none;
      width: fit-content;
      padding: 0;
    `}
`;

const DropdownBodyWrapper = styled.div`
  background-color: var(--white);
  padding: 10px;
  box-shadow: var(--level3);
  border-radius: 10px;
  min-width: 200px;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 100;
`;
