import { forwardRef, HTMLProps, ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface StyledButtonProps extends HTMLProps<HTMLButtonElement> {
  small?: boolean;
  outline?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  background-color: var(--buttonBg);
  color: white;
  border-radius: 5px;
  border: 0px;
  padding: 5px 20px;
  cursor: pointer;
  &:hover {
    box-shadow: var(--level2);
    background-color: var(--buttonHover);
  }
  &:disabled {
    background-color: var(--buttonSubtle);
    cursor: auto;
    &:hover {
      box-shadow: none;
      background-color: var(--buttonSubtle);
    }
  }
  ${props => props.small && smallCss}
  ${props => props.outline && outlineCss}
`;

const ActionButton = styled(StyledButton)`
  --buttonBg: var(--action);
  --buttonHover: var(--actionHover);
  --buttonSubtle: var(--actionSubtle);
`;
const DangerButton = styled(StyledButton)`
  --buttonBg: var(--danger);
  --buttonHover: var(--dangerHover);
  --buttonSubtle: var(--dangerSubtle);
`;

const NeutralButton = styled(StyledButton)`
  --buttonBg: var(--grey-800);
  --buttonHover: var(--grey-800);
  --buttonSubtle: var(--fontColorLight);
`;

interface iTransparentBtnProps {
  underline?: boolean;
  discrete?: boolean;
}
const TransparentButton = styled(StyledButton)<iTransparentBtnProps>`
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

const outlineCss = css`
  background-color: transparent;
  border: 1px solid var(--buttonBg);
  color: var(--buttonBg);
  :hover {
    color: white;
  }
`;

const smallCss = css`
  font-size: var(--smallFontSize);
  padding: 5px 15px;
`;

interface iRadioBtnProps {
  active?: boolean;
}
// This should be used with side by side buttons
// where only one should be selected

const RadioButton = styled(StyledButton)<iRadioBtnProps>`
  --buttonBg: ${props => (props.active ? 'var(--neutral)' : 'transparent')};
  --buttonHover: ${props => (props.active ? 'var(--neutral)' : 'var(--neutralHover)')};
  border: 1px solid var(--neutral);
  color: ${props => (props.active ? 'white' : 'var(--fontColor)')};
  padding: 5px;
  text-align: center;
  border-radius: 0px;
  margin: 0px;
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

interface ButtonProps extends StyledButtonProps {
  loading?: boolean;
  category: 'PRIMARY' | 'ACTION' | 'DANGER' | 'TRANSPARENT' | 'NEUTRAL';
  children: ReactNode;
}

const Button = forwardRef(({ category = 'PRIMARY', loading, children, ...props }: ButtonProps, ref) => {
  return (
    <>
      <StyledButton as={getComponent(category)} {...props} ref={ref}>
        {loading && <p>Loading...</p>}
        {!loading && children}
      </StyledButton>
    </>
  );
});
Button.displayName = 'Buton';

function getComponent(category: 'PRIMARY' | 'ACTION' | 'DANGER' | 'TRANSPARENT' | 'NEUTRAL') {
  if (category === 'PRIMARY') {
    return StyledButton;
  }
  if (category == 'ACTION') {
    return ActionButton;
  }
  if (category === 'DANGER') {
    return DangerButton;
  }
  if (category === 'TRANSPARENT') {
    return TransparentButton;
  }
  if (category === 'NEUTRAL') {
    return NeutralButton;
  }
}

export { StyledButton, ActionButton, DangerButton, TransparentButton, RadioButton, RadioGroup, Button };
