import { useState, memo } from 'react';
import styled from 'styled-components';
import { evaluate } from 'mathjs';
import FormInput from './FormInput';
import { ListRow } from './styled';

const StackInput = styled(FormInput)`
  text-align: right;
  border: none;
  background-color: ${props => (props.danger ? 'var(--dangerSubtle)' : 'transparent')};
  padding: 5px 10px;
  max-width: 100px;
  :hover {
    background-color: ${props => !props.danger && 'var(--rowHoverDark)'};
    border: ${props => props.danger && '1px solid var(--danger)'};
  }
`;

const BudgetStack = ({ label, register, budgetId, amount, updateStack, setValue }) => {
  const [prevAmount, setPrevAmount] = useState(amount);
  return (
    <ListRow>
      <p>{label} </p>
      <StackInput
        name={label}
        type=""
        defaultValue={amount}
        danger={amount < 0}
        register={register}
        onBlur={e => {
          // const newVal = parseFloat(e.target.value);
          const newVal = evaluate(e.target.value);
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
            setValue(label, newVal);
          }
        }}
      />
    </ListRow>
  );
};
export default memo(BudgetStack);
