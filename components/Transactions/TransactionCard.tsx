import styled from 'styled-components';
import { StackDropdown } from 'components/Stack';
import { formatDollars } from 'lib/money';
import { smBreakpoint } from 'lib/constants';

const TransactionCardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid var(--grey-200);
  cursor: pointer;
  :hover {
    background-color: var(--grey-100);
  }
  @media only screen and (max-width: ${smBreakpoint}) {
    font-size: var(--smallFontSize);
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

interface iTransactionCardProps {
  description: string;
  date: string;
  amount: number | string;
  stack?: string;
  isActive?: boolean;
}
export function TransactionCard({ description, date, amount, stack = null, isActive = false }: iTransactionCardProps) {
  return (
    <TransactionCardWrapper>
      <Left>
        <input
          type="checkbox"
          checked={isActive}
          disabled={date.toLowerCase() === 'pending'}
          onChange={() => {
            //do nothing
          }}
        />
        <div style={{ marginLeft: '15px' }}>
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
