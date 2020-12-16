import { useAlert } from './useAlert'
import styled from 'styled-components'
import { AnimatePresence, motion, Variants } from 'framer-motion'

const AlertWrapper = styled(motion.div)`
  position: fixed;
  width:70vw;
  right: 0;
  left: 0;
  height: 30px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 5px;
  height: 40px;
  background-color: var(--action);
  display: flex;
  justify-content: center;
  align-items: center;
`
const variants: Variants = {
  open: { top: 10 },
  closed: { top: -100 },
}
const Alert = () => {
  const { alert } = useAlert()
  return (
    <AnimatePresence>
      {alert && (
        <AlertWrapper transition={{ type: "spring", damping: 13 }} variants={variants} initial="closed" animate="open" exit="closed">
          {alert.message}
        </AlertWrapper>
      )}
    </AnimatePresence>
  )

}

export { Alert }