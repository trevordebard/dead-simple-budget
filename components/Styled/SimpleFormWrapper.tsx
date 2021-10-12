import styled from 'styled-components';

export const SimpleFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 500px;
  min-width: 250px;
  max-width: 500px;
  label {
    color: var(--grey-800);
  }
  input,
  select,
  button {
    margin-bottom: 15px;
  }
  input::placeholder,
  select:required:invalid {
    color: var(--fontColorLighter);
  }
`;
