import styled, { css } from 'styled-components';
import { HTMLProps } from 'react';
import { smBreakpoint } from 'lib/constants';

interface RowProps extends HTMLProps<HTMLTableRowElement> {
  selected?: boolean;
}

export const TR = styled.tr<RowProps>`
  background-color: ${props => props.selected && 'var(--yellow)'};
  :hover {
    background-color: ${props => (props.selected ? 'none' : 'var(--rowHover)')};
  }
`;

export const TD = styled.td`
  padding: 0.3rem;
  @media only screen and (max-width: ${smBreakpoint}) {
    padding: 0.2rem;
  }
`;

export const TH = styled(TD).attrs({ as: 'th' }) <{ sticky?: boolean }>`
  text-align: inherit;
`;

const stickyProps = () => css`
  position: sticky;
  top: 0;
  background-color: var(--white);
`;

export const THead = styled.thead``;

interface TableProps extends HTMLProps<HTMLTableElement> {
  stickyHeader?: boolean;
}
export const Table = styled.table<TableProps>`

  thead tr:nth-child(1) th {
    ${props => props.stickyHeader && stickyProps}
  }
`;
