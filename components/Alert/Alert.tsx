import { useAlert } from './useAlert'
import styled from 'styled-components'

const AlertWrapper = styled.div`
  position: fixed;
  top: 0;
  width:70vw;
  right: 0;
  left: 0;
  height: 30px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 0 0 5px 5px;
  height: 40px;
  background-color: var(--action);
  display: flex;
  justify-content: center;
  align-items: center;
`
const Alert = () => {
  const { alert } = useAlert()
  if (!alert) return null;
  return (
    <AlertWrapper>
      {alert.message}
    </AlertWrapper>
  )

}

export { Alert }