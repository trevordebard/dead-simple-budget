import { useState } from 'react';
import styled from 'styled-components';
import Input from './Input';
import { ListRow } from './styled';

const StackInput = styled(Input)`
  text-align: right;
  border: none;
  background-color: transparent;
  padding: 5px 0px;
  max-width: 120px;
`;

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack, removeStack }) => {
  const [prevValue, setPrevValue] = useState(value);
  return (
    <ListRow>
      <p>{label}: </p>
      <StackInput
        name={label}
        type="number"
        defaultValue={value}
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
      {/* <Input
        type="button"
        value="Delete"
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
