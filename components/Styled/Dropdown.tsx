import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  border-radius: 5px;
  position: relative;
  border: 1px solid var(--grey-800);
`;
export const DropdownHeader = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
`;
export const DropdownBody = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 5px;
  background-color: var(--white);
  padding: 10px;
  box-shadow: var(--level3);
  border-radius: 10px;
`;
