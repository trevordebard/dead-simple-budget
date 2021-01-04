import { motion } from 'framer-motion'
import { smBreakpoint } from 'lib/constants'
import styled from "styled-components"


export const ActionSidebar = styled(motion.div)`
  @media only screen and (max-width: ${smBreakpoint}) {
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
  }
  background-color: var(--white);
`