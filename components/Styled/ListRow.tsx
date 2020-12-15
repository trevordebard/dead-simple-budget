import styled from 'styled-components';

// TODO: Eventually this will maybe need to be more generic. Maybe it should be a react component that accepts Left, Center, and Right children components??
const ListRow = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--lineColor);
  padding: 5px;
  background-color: ${props => props.selected && 'var(--yellow)'};
  :hover {
    background-color: ${props => !props.selected && 'var(--rowHover)'};
  }
`;

export default ListRow;
