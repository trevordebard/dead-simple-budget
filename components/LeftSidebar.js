import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { useRouter } from 'next/dist/client/router';

// TODO: This should probably use the Button style
const TabItem = styled.li`
  min-width: 170px;
  width: 80%;
  height: 40px;
  margin: 10px 0px;
  background: ${props => (props.active ? 'var(--purp)' : 'white')};
  border-radius: 45px;
  color: ${props => (props.active ? 'white' : 'hsl(209, 34%, 30%)')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 300;
  cursor: pointer;
  :hover {
    ${props => !props.active && 'background-color: var(--purp-15)'};
  }
`;
const Tabs = styled.div`
  max-width: 300px;
  grid-column: 1 / 2;
  border-right: 1px solid var(--lineColor);
  padding-top: 30px;
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const LeftSidebar = () => {
  const router = useRouter();
  return (
    <Tabs>
      <ul>
        <Link href="/budget">
          <TabItem active={router.pathname === '/budget'}>
            <a>Budget</a>
          </TabItem>
        </Link>
        <Link href="/transactions">
          <TabItem active={router.pathname === '/transactions'}>
            <a>Transactions</a>
          </TabItem>
        </Link>
      </ul>
    </Tabs>
  );
};

export default LeftSidebar;
