import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { smBreakpoint } from '../../lib/constants';
import { Button } from 'components/Styled';

interface iTabProps {
  active?: boolean;
}
const TabItem = styled.li<iTabProps>`
  + li {
    margin-top: 1em;
  }
  a {
    display: block;
    background-color: ${props => !props.active && 'white'};
    color: ${props => !props.active && 'var(--fontcolor)'};
    cursor: pointer;
    :hover {
      ${props => !props.active && 'background-color: var(--primarySubtle)'};
    }
  }
  @media only screen and (max-width: ${smBreakpoint}) {
    a {
      background-color: transparent;
      color: ${props => (props.active ? 'var(--purple-800)' : 'var(--fontColor)')};
      margin: 0px;
      :hover {
        background-color: transparent;
        box-shadow: none;
      }
    }
    + li {
      margin-top: 0;
    }
    border-bottom: ${props => props.active && '1px solid var(--purple-800)'};
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
const TabSidebar = () => {
  const router = useRouter();
  return (
    <Tabs>
      <ul>
        <Link href="/budget" passHref>
          <TabItem active={router.pathname === '/budget'}>
            <Button category="TRANSPARENT" as="a">
              Budget
            </Button>
          </TabItem>
        </Link>
        <Link href="/transactions" passHref>
          <TabItem active={router.pathname === '/transactions'}>
            <Button category="TRANSPARENT" as="a">
              Transactions
            </Button>
          </TabItem>
        </Link>
      </ul>
    </Tabs>
  );
};

export default TabSidebar;
