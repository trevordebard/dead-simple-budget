import styled from 'styled-components';
import { StackDropdown } from 'components/Stack';
import { formatDollars } from 'lib/money';

const TransactionCardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid var(--grey-200);
  cursor: pointer;
  font-size: 0.8rem;
  :hover {
    background-color: var(--grey-100);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  min-width: 80px;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Amount = styled.p`
  color: var(--fontColor);
`;

const Description = styled.p`
  color: var(--fontColor);
  line-height: 1.2;
`;

const SubtleContent = styled.div`
  color: var(--fontColorLight);
`;

export function TransactionCard({ description, date, amount, stack, isActive = false, ...props }) {
  return (
    <TransactionCardWrapper {...props}>
      <Left>
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => {
            //do nothing
          }}
        />
        <div style={{ marginLeft: '20px' }}>
          <Description>{description}</Description>
          <SubtleContent>{stack ? <p>{stack}</p> : <StackDropdown inline defaultStack="Select Stack" />}</SubtleContent>
        </div>
      </Left>
      <Right>
        <Amount>{formatDollars(amount)}</Amount>
        <SubtleContent>{date}</SubtleContent>
      </Right>
    </TransactionCardWrapper>
  );
}
