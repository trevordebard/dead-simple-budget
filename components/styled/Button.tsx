import { FC, FunctionComponent, HTMLProps, ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface StyledButtonProps {
  small?: boolean;
}
const StyledButton = styled.button<StyledButtonProps>`
  background-color: var(--buttonBg);
  color: white;
  border-radius: 45px;
  border: 0px;
  padding: 5px 20px;
  cursor: pointer;
  &:hover {
    box-shadow: var(--level2);
    background-color: var(--buttonHover);
  }
  &:disabled {
    background-color: var(--buttonHover);
    cursor: auto;
    &:hover {
      box-shadow: none;
      background-color: var(--buttonHover);
    }
  }
  ${props =>
    props.small &&
    css`
      font-size: var(--smallFontSize);
      padding: 5px 15px;
    `}
`;

const ActionButton = styled(StyledButton)`
  --buttonBg: var(--action);
  --buttonHover: var(--actionHover);
`;
const DangerButton = styled(StyledButton)`
  --buttonBg: var(--danger);
  --buttonHover: var(--dangerHover);
`;
const TransparentButton = styled(StyledButton) <{ underline?: boolean, discrete?: boolean }>`
  --buttonBg: transparent;
  --buttonHover: transparent;
  color: var(--fontColor);
  text-decoration: ${props => props.underline && 'underline'};
  &:hover {
    box-shadow: none;
  }
  ${({ discrete }) =>
    discrete &&
    css`
      padding: 0px;
      display: inline-block;
    `}
`;

// This should be used with side by side buttons
// where only one should be selected
const RadioButton = styled(StyledButton) <{ active?: boolean }>`
  --buttonBg: ${props => (props.active ? 'var(--neutral)' : 'transparent')};
  --buttonHover: ${props => (props.active ? 'var(--neutral)' : 'var(--neutralHover)')};
  border: 1px solid var(--neutral);
  color: ${props => (props.active ? 'white' : 'var(--fontColor)')};
  padding: 5px;
  text-align: center;
  border-radius: 0px;
  cursor: pointer;
  + button {
    border-left: none;
  }
  :focus {
    outline-color: var(--primary);
    outline-style: inherit;
  }
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
`;

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  loading: boolean;
  category: 'PRIMARY' | 'ACTION' | 'DANGER' | 'TRANSPARENT';
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ category = 'PRIMARY', loading, children, ...props }: ButtonProps) => {
  return (
    <>
      <StyledButton as={getComponent(category)} {...props}>
        {loading && <p>Loading...</p>}
        {!loading && children}
      </StyledButton>
    </>
  )
};
function getComponent(category: 'PRIMARY' | 'ACTION' | 'DANGER' | 'TRANSPARENT') {
  if (category === 'PRIMARY') {
    return StyledButton
  }
  if (category == 'ACTION') {
    return ActionButton
  }
  if (category === 'DANGER') {
    return DangerButton
  }
  if (category === 'TRANSPARENT') {
    return TransparentButton
  }
}

export { StyledButton, ActionButton, DangerButton, TransparentButton, RadioButton, RadioGroup, Button };
