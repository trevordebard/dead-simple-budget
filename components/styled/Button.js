import styled, { css } from 'styled-components';

const Button = styled.button`
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

const ActionButton = styled(Button)`
  --buttonBg: var(--action);
  --buttonHover: var(--actionHover);
`;
const DangerButton = styled(Button)`
  --buttonBg: var(--danger);
  --buttonHover: var(--dangerHover);
`;
const TransparentButton = styled(Button)`
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
const RadioButton = styled(Button)`
  --buttonBg: ${props => (props.active ? 'var(--neutral)' : 'transparent')};
  --buttonHover: ${props => (props.active ? 'var(--neutral)' : 'var(--neutralHover)')};
  border: 1px solid var(--neutral);
  color: ${props => (props.active ? 'white' : 'var(--fontColor)')};
  padding: 5px;
  text-align: center;
  border-radius: 0;
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

export { Button, ActionButton, DangerButton, TransparentButton, RadioButton, RadioGroup };
