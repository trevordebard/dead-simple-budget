import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { smBreakpoint } from '../lib/constants';
import { Button } from './styled';

const TabItem = styled.li`
  + li {
    margin-top: 1em;
  }
  a {
    display: block;
    background-color: ${props => !props.active && 'white'};
    color: ${props => !props.active && 'var(--fontcolor)'};
    cursor: pointer;
    :hover {
      ${props => !props.active && 'background-color: var(--primaryHover)'};
    }
  }
  @media only screen and (max-width: ${smBreakpoint}) {
    a {
      background-color: transparent;
      color: ${props => (props.active ? 'var(--purp)' : 'var(--fontColor)')};
      margin: 0px;
      :hover {
        background-color: transparent;
        box-shadow: none;
      }
    }
    + li {
      margin-top: 0;
    }
    border-bottom: ${props => props.active && '1px solid black'};
  }
`;
const Tabs = styled.div`
  ul {
    min-width: 170px;
  }
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
            <Button as="a">Budget</Button>
          </TabItem>
        </Link>
        <Link href="/transactions">
          <TabItem active={router.pathname === '/transactions'}>
            <Button as="a">Transactions</Button>
          </TabItem>
        </Link>
      </ul>
    </Tabs>
  );
};

export default LeftSidebar;
