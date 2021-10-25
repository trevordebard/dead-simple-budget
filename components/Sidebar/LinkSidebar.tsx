import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { smBreakpoint } from '../../lib/constants';

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  @media only screen and (max-width: ${smBreakpoint}) {
    padding: 0;
    background-color: var(--backgroundSubtle);
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }
`;

const ButtonLink = styled.a<{ active?: boolean }>`
  text-decoration: none;
  background-color: ${props => (props.active ? 'var(--purple-400)' : 'transparent')};
  color: var(--fontColor);
  color: ${props => (props.active ? 'white' : 'var(--fontColor)')};
  border-radius: 5px;
  border: 0px;
  padding: 5px 20px;
  cursor: pointer;
  text-align: center;
  :hover {
    background-color: var(--purple-300);
    color: white;
  }
  @media only screen and (max-width: ${smBreakpoint}) {
    background-color: transparent;
    color: ${props => (props.active ? 'var(--purple-400)' : 'var(--fontColor)')};
    font-size: 1.1rem;
    :hover {
      border-radius: 5px;
      background-color: var(--grey-200);
      box-shadow: none;
      color: ${props => (props.active ? 'var(--purple-400)' : 'var(--fontColor)')};
    }
  }
`;

const LinkSidebar = () => {
  const router = useRouter();
  return (
    <SidebarWrapper>
      <Link href="/budget" passHref>
        <ButtonLink active={router.pathname === '/budget'}>Budget</ButtonLink>
      </Link>
      <Link href="/transactions" passHref>
        <ButtonLink active={router.pathname === '/transactions'}>Transactions</ButtonLink>
      </Link>
    </SidebarWrapper>
  );
};

export default LinkSidebar;
