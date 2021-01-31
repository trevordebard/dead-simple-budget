import styled, { css } from 'styled-components';

interface InputProps {
  category?: 'underline';
}

const Input = styled.input<InputProps>`
  border-radius: 5px;
  padding: 0.4em;
  border: 1px solid var(--grey-800);
  ${props => props.category === 'underline' && UnderlineCss}
`;

const UnderlineCss = css`
  border-left: none;
  border-top: none;
  border-right: none;
  border-radius: 0;
  border-bottom: 1px solid var(--grey-600);
  :focus {
    outline: none;
    border-bottom: 1.5px solid var(--aqua-500);
  }
`;
export { Input };
