import styled from 'styled-components';
import { smBreakpoint } from '../../lib/constants';

const AppLayout = styled.div`
  margin: 0 auto;
`;

export const Main = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 20%;
  grid-template-rows: auto;
  grid-template-areas: 'left center right';
  grid-gap: 1rem;

  @media only screen and (max-width: ${smBreakpoint}) {
    flex-direction: column;
    grid-template-columns: 1fr;
    grid-template-areas:
      'left'
      'right'
      'center';
    padding: 0;
    grid-gap: 0;
  }
`;

export const Left = styled.nav`
  grid-area: left;
`;
export const Center = styled.div`
  grid-area: center;
  padding: 0 1rem;
`;
export const Right = styled.nav`
  grid-area: right;
`;

const Layout = ({ children }) => <AppLayout>{children}</AppLayout>;
export default Layout;
