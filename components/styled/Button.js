import styled, { css } from 'styled-components';

/**
 * Accepts the following props
 * @action
 * @primary
 */
const Button = styled.button`
  background-color: var(--neutral);
  color: white;
  border-radius: 45px;
  border: 0px;
  cursor: pointer;
  ${props => {
    if (props.primary) {
      return css`
        background-color: var(--primary);
      `;
    }
    if (props.action) {
      return css`
        background-color: var(--action);
      `;
    }
    if (props.transparent) {
      return css`
        background-color: transparent;
        color: var(--fontColor);
      `;
    }
  }}
`;
export default Button;
