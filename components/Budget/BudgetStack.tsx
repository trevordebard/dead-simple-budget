import { useState, memo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { evaluate } from 'mathjs';
import { ListRow } from '../Styled';
import { BudgetContext } from 'pages/budget';
import { useUpdateStack } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';
import { ReorderIcon } from 'components/Shared/ReorderIcon';

const StackInput = styled.input<{ danger: boolean }>`
  text-align: right;
  border: none;
  background-color: ${props => (props.danger ? 'var(--dangerSubtle)' : 'transparent')};
  border-radius: 5px;
  padding: 5px 10px;
  max-width: 100px;
  :hover {
    background-color: ${props => !props.danger && 'var(--rowHoverDark)'};
    border: ${props => props.danger && '1px solid var(--danger)'};
  }
`;

const BudgetStack = ({ label, amount, id, dragControls = null }) => {
  const [prevAmount, setPrevAmount] = useState<string>(amount);
  const [inputAmount, setInputAmount] = useState(centsToDollars(amount));
  const { mutate: updateStack } = useUpdateStack();
  const budgetContext = useContext(BudgetContext);
  const handleRowClick = () => {
    if (budgetContext.stackInFocus === id) {
      budgetContext.setStackInFocus(null);
    } else {
      budgetContext.setStackInFocus(id);
    }
  };
  useEffect(() => {
    setInputAmount(centsToDollars(amount));
  }, [amount, setInputAmount]);

  return (
    <ListRow selected={id === budgetContext.stackInFocus} onClick={handleRowClick}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {dragControls && <ReorderIcon dragControls={dragControls} />}
        <p>{label} </p>
      </div>
      <StackInput
        name={label}
        value={inputAmount}
        onChange={e => setInputAmount(e.target.value)}
        onFocus={e => {
          setPrevAmount(e.target.value.replace(/\,/g, ''));
        }}
        danger={parseFloat(inputAmount) < 0}
        onClick={e => e.stopPropagation()} // Prevent ListRow from being selected
        onBlur={e => {
          let newAmt = e.target.value.replace(/\,/g, '');
          if (prevAmount !== newAmt) {
            newAmt = evaluate(newAmt);
            setInputAmount(newAmt);
            updateStack({ id, label, amount: dollarsToCents(newAmt) });
          }
        }}
      />
    </ListRow>
  );
};
export default memo(BudgetStack);
