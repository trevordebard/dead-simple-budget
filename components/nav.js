import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import { useSession, signOut } from 'next-auth/client';
import Logo from './Logo.svg';
import { Button } from './styled';

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
      <LoggedInNav email={session?.user?.email} />
    </NavContainer>
  );
};

const LoggedInNav = ({ email }) => {
  const client = useApolloClient();
  const router = useRouter();
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
            await client.clearStore();
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
