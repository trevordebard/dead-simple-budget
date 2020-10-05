import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import { useSession } from 'next-auth/client';
import Logo from './Logo.svg';
import { TransparentButton } from './styled';

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
const LOGOUT = gql`
  mutation LOGOUT {
    logout {
      message
    }
  }
`;
const LoggedInNav = ({ email }) => {
  const router = useRouter();
  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT, {
    onCompleted: async () => {
      await client.clearStore();
      router.push('/login');
    },
  });
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
        <TransparentButton transparent onClick={() => logout()}>
          Logout
        </TransparentButton>
      </Account>
    </>
  );
};

export default Nav;
