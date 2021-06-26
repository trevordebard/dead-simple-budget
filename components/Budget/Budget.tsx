import React, { useState } from 'react';
import styled from 'styled-components';
import useBudget from './useBudget';
import BudgetStack from './BudgetStack';
import { Button, Input } from 'components/Styled';
import EditableText from 'components/Shared/EditableText';
import { useAlert } from 'components/Alert';
import { useSession } from 'next-auth/client';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
`;

const BudgetWrapper = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  width: 400px;
`;
const Amount = styled.span<{ danger?: boolean; editable?: boolean }>`
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
  const { stacks, loading, error, userTotals, updateUserTotal, createStack } = useBudget();
  const [session] = useSession();
  const [editTotalVisible, setEditTotalVisible] = useState(false);
  const { addAlert, removeAlert, alert } = useAlert();
  if (loading) {
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
          <Amount editable danger={userTotals.total < 0} onClick={() => setEditTotalVisible(!editTotalVisible)}>
            <EditableText
              text={userTotals.total}
              update={total => {
                updateUserTotal({ email: session.user.email, total: parseFloat(total) });
              }}
              inputType="number"
            />
          </Amount>
          <SubText> in account</SubText>
        </h5>
        <h5>
          <Amount danger={userTotals.toBeBudgeted < 0}>{userTotals.toBeBudgeted}</Amount>
          <SubText> to be budgeted</SubText>
        </h5>
      </ToplineBudget>
      <Stacks stacks={stacks} budgetId={1} />
      <NewStackWrapper>
        <NewStack />
      </NewStackWrapper>
      <br />
    </BudgetWrapper>
  );
}

const Stacks = ({ stacks, budgetId }) => {
  if (stacks) {
    return stacks.map(item => (
      <div key={item.id}>
        <BudgetStack id={item.id} label={item.label} budgetId={budgetId} amount={item.amount} />
      </div>
    ));
  }
  return <></>;
};

const NewStack = () => {
  const { addAlert } = useAlert();
  const { createStack } = useBudget();
  const [newStack, setNewStack] = useState<string>('');
  const handleAddStack = (stackName: string) => {
    if (!newStack || newStack.trim() === '') {
      addAlert({ message: 'Stack name cannot be empty.', type: 'error' });
    } else {
      createStack({ label: newStack });
      setNewStack('');
    }
  };
  return (
    <>
      <Input
        name="newStack"
        placeholder="Stack Name"
        autoComplete="off"
        value={newStack}
        onChange={e => setNewStack(e.target.value)}
      />
      <Button category="ACTION" name="addStack" onClick={() => handleAddStack(newStack)}>
        Add Stack
      </Button>
    </>
  );
};
export default Budget;
