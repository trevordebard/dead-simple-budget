import React, { useState } from 'react';
import styled from 'styled-components';
import useBudget from './useBudget';
import BudgetStack from './BudgetStack';
import { Button, Input } from 'components/Styled';
import EditableText from 'components/Shared/EditableText';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
`;

const BudgetWrapper = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  width: 400px;
`;
const Amount = styled.span<{ danger?: boolean, editable?: boolean }>`
  font-weight: 500;
  color: ${props => (props.danger ? 'var(--danger)' : 'var(--fontColor)')};
  ::before {
    content: '$';
  }
  span {
    &:hover {
      color: ${props => (props.editable ? 'var(--action)' : 'inherit')};
      cursor: ${props => (props.editable ? 'pointer' : 'inherit')};
    }
  }
`;
const SubText = styled.span`
  font-weight: 400;
  color: var(--fontColor-o60);
`;

const NewStackWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 10px 0px;
  grid-column-gap: 5px;
  white-space: nowrap;
`;

function Budget() {
  const { budget, loading, error, updateTotal } = useBudget();
  const [editTotalVisible, setEditTotalVisible] = useState(false);

  if (loading || !budget) {
    return <span>loading...</span>;
  }
  if (error) {
    return <p>error...</p>;
  }
  return (
    <BudgetWrapper>
      <ToplineBudget>
        <h1>Budget</h1>
        <h5>
          <Amount editable danger={budget.total < 0} onClick={() => setEditTotalVisible(!editTotalVisible)}>
            <EditableText
              text={budget.total}
              update={total =>
                updateTotal({
                  variables: {
                    total: parseFloat(total),
                    budgetId: budget.id,
                  },
                })}
              inputType="number"
            />
          </Amount>
          <SubText> in account</SubText>
        </h5>
        <h5>
          <Amount danger={budget.toBeBudgeted < 0}>{budget.toBeBudgeted}</Amount>
          <SubText> to be budgeted</SubText>
        </h5>
      </ToplineBudget>
      <Stacks stacks={budget.stacks} budgetId={budget.id} />
      <NewStackWrapper>
        <NewStack budgetId={budget.id} />
      </NewStackWrapper>
      <br />
    </BudgetWrapper>
  );
}

const Stacks = ({ stacks, budgetId }) => {
  return (
    stacks.map(item => (
      <div key={item.id}>
        <BudgetStack id={item.id} label={item.label} budgetId={budgetId} amount={item.amount} />
      </div>
    ))
  )
};

const NewStack = ({ budgetId }) => {
  const { addStack } = useBudget();
  const [newStack, setNewStack] = useState<string>("")
  const handleAddStack = (stackName: string) => {
    addStack({
      variables: { newStackLabel: newStack, budgetId },
    });
    setNewStack("")
  };
  return (

    <>
      <Input name="newStack" placeholder="Stack Name" autoComplete="off" value={newStack} onChange={e => setNewStack(e.target.value)} />
      <Button category="ACTION" name="addStack" onClick={() => handleAddStack(newStack)}>
        Add Stack
    </Button>
    </>
  )
}
export default Budget;
