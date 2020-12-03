import { useState, memo, useContext } from 'react';
import styled from 'styled-components';
import { evaluate } from 'mathjs';
import useBudget from 'hooks/useBudget';
import { ListRow } from './styled';
import { BudgetContext } from 'pages/budget';

const StackInput = styled.input<{ danger: boolean }>`
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

const BudgetStack = ({ label, budgetId, amount, id }) => {
  const [prevAmount, setPrevAmount] = useState<number>(amount);
  const { updateStack } = useBudget();
  const budgetContext = useContext(BudgetContext)
  return (
    <ListRow selected={id === budgetContext.stackInFocus} onClick={() => budgetContext.setStackInFocus(id)}>
      <p>{label} </p>
      <StackInput
        name={label}
        type=""
        defaultValue={amount}
        danger={amount < 0}
        onBlur={e => {
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
          }
        }}
      />
    </ListRow>
  );
};
export default memo(BudgetStack);
