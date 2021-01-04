import { useAlert } from './useAlert'
import styled, { css } from 'styled-components'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useEffect } from 'react'
import { AlertTypes } from './AlertProvider'
import { smBreakpoint } from 'lib/constants'

interface StyledAlertProps {
  type?: AlertTypes
}
const AlertWrapper = styled(motion.div) <StyledAlertProps>`
  position: fixed;
  color: var(--white);
  width:70vw;
  right: 0;
  left: 0;
  height: 30px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 5px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => (props.type === 'neutral' || !props.type) && AlertNeutralCss};
  ${props => props.type === 'error' && AlertErrorCss};
  ${props => props.type === 'success' && AlertSuccessCss};
  @media only screen and (max-width: ${smBreakpoint}) {
    padding: 10px;
    min-width: 85vw;
  }
`
const AlertSuccessCss = css`
  background-color: var(--green-500);
`
const AlertErrorCss = css`
  background-color: var(--red-600);
`
const AlertNeutralCss = css`
  background-color: var(--grey-100);
  color: var(--grey-500);
`

const variants: Variants = {
  open: { top: 10 },
  closed: { top: -100 },
}
const Alert = () => {
  const { alert, removeAlert } = useAlert();
  useEffect(() => {
    if (alert) {
      let timerFunc = setTimeout(() => {
        removeAlert()
      }, alert.duration * 1000 || 4000);
      return () => clearTimeout(timerFunc);
    }
  }, [alert, removeAlert]);
  return (
    <AnimatePresence>
      {alert && (
        <AlertWrapper type={alert.type} transition={{ type: "spring", damping: 13 }} variants={variants} initial="closed" animate="open" exit="closed">
          {alert.message}
        </AlertWrapper>
      )}
    </AnimatePresence>
  )

}

export { Alert }