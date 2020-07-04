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
  ${({ small }) => {
    if (small) {
      return css`
        font-size: var(--smallFontSize);
        padding: 5px 15px;
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
      &:hover {
        background-color: var(--primaryLight);
      }
    `}
`;

export { Button, ActionButton, DangerButton, TransparentButton };
