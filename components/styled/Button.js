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
  width: ${props => props.width || 'auto'};
  ${props => {
    if (props.primary) {
      return css`
        background-color: var(--primary);
      `;
    }
    if (props.isAction) {
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
  }};
`;
export default Button;
