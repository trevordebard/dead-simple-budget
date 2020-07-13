import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styled from 'styled-components';
import { smBreakpoint } from '../lib/constants';

const StyledModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: hsl(0, 0%, 0%, 50%);
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  box-shadow: var(--level3);
  border-radius: 5px;
  padding: 20px;
  display: grid;
  place-items: center;
  border: 1px solid var(--lineColor);
  min-width: 350px;
  max-width: 450px;
  min-height: 50%;
  max-height: 90%;
  background-color: white;
  @media only screen and (max-width: ${smBreakpoint}) {
    max-width: 90vw;
    min-width: 70vw;
  }
`;

const Modal = ({ children, visible, hide }) =>
  visible && (
    <StyledModal>
      <ClickAwayListener onClickAway={() => hide()}>{children}</ClickAwayListener>
    </StyledModal>
  );
export default Modal;

export { ModalCard };
