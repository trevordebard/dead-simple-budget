import styled from 'styled-components';
import Nav from './nav';
import TabSidebar from './TabSidebar';
import { smBreakpoint } from '../lib/constants';

const AppLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 230px) 3fr;
  grid-template-rows: min-content auto;
  height: 100vh;
  margin: 0 auto;
  max-width: 1200px;
  grid-template-areas:
    'nav nav'
    'sidebar content';
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, min-content) auto;
    grid-template-areas:
      'nav'
      'sidebar'
      'content';
    margin: auto 0;
  }
`;
const NavWrapper = styled.div`
  grid-area: nav;
`;
const SidebarWrapper = styled.div`
  grid-area: sidebar;
  border-right: 1px solid var(--lineColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-column: 1 / -1;
    width: 100vw;
    height: min-content;
    flex-direction: row;
    justify-content: center;
    background-color: var(--backgroundSubtle);
    padding: 0;
    margin: 0;
  }
`;
const Content = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-column: 1;
    max-width: 100vw !important;
  }
`;

const Layout = ({ children }) => (
  <AppLayout>
    <NavWrapper>
      <Nav />
    </NavWrapper>
    <SidebarWrapper>
      <TabSidebar />
    </SidebarWrapper>
    <Content>{children}</Content>
  </AppLayout>
);
export default Layout;
