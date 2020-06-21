import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import useUser from '../hooks/useUser';
import Logo from './Logo.svg';

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
  /*TODO: Not wasting time styling because eventually this component should be an icon with dropdown to logout, see settings, etc*/
  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
  }
`;
const Nav = () => {
  const { user, loggedIn, loading } = useUser();
  if (loading) {
    return null;
  }
  return <NavContainer>{loggedIn ? <LoggedInNav email={user.email} /> : <LoggedOutNav />}</NavContainer>;
};
const LOGOUT = gql`
  mutation LOGOUT {
    userLogout {
      record {
        email
      }
    }
  }
`;
const LoggedInNav = ({ email }) => {
  const router = useRouter();
  console.log(router.pathname);
  const [logout] = useMutation(LOGOUT);
  return (
    <>
      <LogoWrapper>
        <Link href="/">
          <Logo />
        </Link>
      </LogoWrapper>

      <Account>
        <p>{email}</p>
        <button type="button" onClick={() => logout()}>
          Logout
        </button>
      </Account>
    </>
  );
};

const LoggedOutNav = () => (
  <>
    <LogoWrapper>
      <Link href="/">
        <h1>Budget Trace</h1>
      </Link>
    </LogoWrapper>
    <Account>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </Account>
  </>
);

export default Nav;
