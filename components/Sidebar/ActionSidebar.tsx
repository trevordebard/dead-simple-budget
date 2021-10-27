import { motion } from 'framer-motion';
import { smBreakpoint } from 'lib/constants';
import styled from 'styled-components';

export const ActionSidebar = styled(motion.div)`
  @media only screen and (max-width: ${smBreakpoint}) {
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
  }
  background-color: var(--white);
`;
