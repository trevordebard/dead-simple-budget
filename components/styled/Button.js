import styled, { css } from 'styled-components';

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border-radius: 45px;
  border: 0px;
  padding: 5px 20px;
  cursor: pointer;
  &:hover {
    box-shadow: var(--level2);
    background-color: var(--primaryLight);
  }
  ${({ small, disabled }) => {
    if (small) {
      return css`
        font-size: var(--smallFontSize);
        padding: 5px 15px;
      `;
    }
    if (disabled) {
      return css`
        background-color: var(--primaryHover);
        cursor: auto;
        &:hover {
          box-shadow: none;
          background-color: var(--primaryHover);
        }
      `;
    }
  }}
`;

const ActionButton = styled(Button)`
  background: var(--action);
  &:hover {
    background-color: var(--actionLight);
  }
`;
const DangerButton = styled(Button)`
  background: var(--danger);
  &:hover {
    background-color: var(--dangerLight);
  }
`;
const TransparentButton = styled(Button)`
  background: transparent;
  color: var(--fontColor);
  text-decoration: ${props => props.underline && 'underline'};
  &:hover {
    background-color: transparent;
    box-shadow: none;
  }
  ${({ discrete }) =>
    discrete &&
    css`
      padding: 0px;
      width: min-content;
      display: inline-block;
    `}
`;

// This should be used with side by side buttons
// where only one should be selected
const RadioButton = styled(Button)`
  background: ${props => (props.active ? 'var(--neutral)' : 'transparent')};
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
  :hover {
    background: ${props => (props.active ? 'var(--neutral)' : 'var(--neutralHover)')};
  }
`;

export { Button, ActionButton, DangerButton, TransparentButton, RadioButton };
