import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { useSession, signOut } from 'next-auth/client';
import Logo from './Logo.svg';
import { Button } from '../Styled';
import { useQueryClient } from 'react-query';

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 1px solid var(--lineColor);
  a {
    text-decoration: none;
  }
  padding: 10px;
`;
const LogoWrapper = styled.div`
  grid-column: 1 / 2;
  display: flex;
  align-items: center;
  margin-left: 20px;
  justify-content: flex-start;
  h1 {
    cursor: pointer;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const Nav = () => {
  const [session] = useSession();

  return (
    <NavContainer>
      <LoggedInNav email={session.user.email.split('@')[0]} />
    </NavContainer>
  );
};

const LoggedInNav = ({ email }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return (
    <>
      <LogoWrapper>
        <Link href="/">
          <>
            <Logo />
          </>
        </Link>
      </LogoWrapper>

      <Account>
        <p>{email}</p>
        <Button
          category="TRANSPARENT"
          onClick={async () => {
            signOut();
            queryClient.clear();
            router.push('/login');
          }}
        >
          Logout
        </Button>
      </Account>
    </>
  );
};

export default Nav;
