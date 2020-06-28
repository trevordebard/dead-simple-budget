import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { smBreakpoint } from '../lib/constants';

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
  @media only screen and (max-width: ${smBreakpoint}) {
    background-color: transparent;
    color: ${props => (props.active ? 'var(--purp)' : 'var(--fontColor)')};
    font-size: 1.4rem;
    margin: 0px;
    width: min-content;
    font-weight: 400;
    :hover {
      background-color: transparent;
    }
  }
`;
const Tabs = styled.div`
  @media only screen and (max-width: ${smBreakpoint}) {
    ul {
      display: flex;
      justify-content: center;
    }
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
