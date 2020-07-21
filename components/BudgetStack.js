import { useState } from 'react';
import styled from 'styled-components';
import FormInput from './FormInput';
import { ListRow } from './styled';

const StackInput = styled(FormInput)`
  text-align: right;
  border: none;
  background-color: ${props => (props.danger ? 'var(--dangerHover)' : 'transparent')};
  padding: 5px 0px;
  max-width: 100px;
  :hover {
    background-color: ${props => !props.danger && 'var(--rowHoverDark)'};
    border: ${props => props.danger && '1px solid var(--danger)'};
  }
`;

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack, removeStack }) => {
  const [prevValue, setPrevValue] = useState(value);
  return (
    <ListRow>
      <p>{label} </p>
      <StackInput
        name={label}
        type="number"
        defaultValue={value}
        danger={value < 0}
        register={register}
        onBlur={e => {
          const newVal = parseFloat(e.target.value);
          // Prevent api call if vlaue didn't change
          if (newVal !== prevValue) {
            updateStack({
              variables: {
                budgetId,
                label,
                value: newVal,
              },
            });
            setPrevValue(newVal);
          }
        }}
      />
      {/* <FormInput
        type="button"
        value="Delete"
        register={register}
        onClick={e => {
          removeStack({
            variables: {
              budgetId,
              label,
            },
          });
        }}
      /> */}
    </ListRow>
  );
};
export default BudgetStack;
