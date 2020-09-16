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

const BudgetStack = ({ label, register, budgetId, amount, errors, updateStack, removeStack }) => {
  const [prevAmount, setPrevAmount] = useState(amount);
  return (
    <ListRow>
      <p>{label} </p>
      <StackInput
        name={label}
        type="number"
        defaultValue={amount}
        danger={amount < 0}
        register={register}
        onBlur={e => {
          const newVal = parseFloat(e.target.value);
          // Prevent api call if vlaue didn't change
          if (newVal !== prevAmount) {
            updateStack({
              variables: {
                budgetId,
                label,
                amount: newVal,
              },
            });
            setPrevAmount(newVal);
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
