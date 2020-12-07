import { motion } from 'framer-motion';
import styled from 'styled-components';
import { smBreakpoint } from '../lib/constants';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
`;

export const Center = styled.div`
  flex-grow: 1;
  margin: 0 auto;
  padding: 1rem;
`;

export const Main = styled.div`
  position: relative;
  /* Take the remaining height */
  flex-grow: 1;

  /* Layout the left sidebar, main content and right sidebar */
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: ${smBreakpoint}) {
    flex-direction: column;
  }
`;
export const Left = styled.nav`
  width: 20%;
  max-width: 250px;
  border-right: 1px solid var(--lineColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  @media only screen and (max-width: ${smBreakpoint}) {
    width: 100%;
    max-width: 100vw;
    background-color: var(--backgroundSubtle);
    padding: 0;
    margin: 0;
  }
`;
export const Right = styled(motion.nav)`
  width: 20%;
  border-left: 1px solid var(--lineColor);
  background-color: var(--white);
  @media only screen and (max-width: ${smBreakpoint}) {
    width: 100%;
    position: absolute;
    height: 100%;
    right: 0;
  }
`;

const Layout = ({ children }) => <AppLayout>{children}</AppLayout>;
export default Layout;
