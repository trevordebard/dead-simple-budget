import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useRouter } from 'next/dist/client/router';
import { smBreakpoint } from '../lib/constants';

import { Button } from './styled';

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
const Tabs = styled.div``;
const LeftSidebar = () => {
  const router = useRouter();
  const [isTabListVisible, setIsTabListVisible] = useState(true);
  const matches = useMediaQuery(`(max-width: ${smBreakpoint})`);
  useEffect(() => {
    if (!matches) {
      setIsTabListVisible(false);
    }
  }, [matches]);
  return (
    <Tabs>
      {matches && (
        <Button transparent onClick={() => setIsTabListVisible(!isTabListVisible)}>
          Menu
        </Button>
      )}
      {(!matches || isTabListVisible) && (
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
      )}
    </Tabs>
  );
};

export default LeftSidebar;
