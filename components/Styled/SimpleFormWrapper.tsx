import styled from 'styled-components';

export const SimpleFormWrapper = styled.form`
  display: flex;
  background-color: white;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  label {
    color: var(--grey-800);
  }
  input,
  select,
  button,
  hr {
    margin-bottom: 15px;
  }
  input::placeholder,
  select:required:invalid {
    color: var(--fontColorLighter);
  }
`;
