

import styled from 'styled-components';
export const StickyWrapper = styled.div<{ top: string }>`
  position: sticky;
  top: ${props => props.top};
`