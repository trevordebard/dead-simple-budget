import { ApolloProvider } from '@apollo/client';
import styled, { createGlobalStyle } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { withApollo } from '../lib/withApollo';
import Nav from '../components/nav';

const GlobalStyle = createGlobalStyle`
  :root {
    --purp: #8E44AD;
    --blue: #2DADBA;
    --yellow: #FAEA7A;
    --green: hsl(152, 55,44);
    --lineColor: #EAEAEA;
  }
  * {
    box-sizing: border-box;
  }
  body {
    height: 100vh;
    margin: 0;
    padding: 0;
  }
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  li,
  p,
  pre,
  blockquote,
  figure,
  hr {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
  }
  input,
  textarea,
  select,
  button {
    color: inherit; 
    font: inherit; 
    letter-spacing: inherit; 
  }
  input,
  textarea,
  button {
    border: 1px solid gray; 
  }
  button, input[type='button'] {
    border-radius: 0; 
    background-color: transparent;
  }
`;

const AppLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  grid-column-gap: 15px;
`;
const NavWrapper = styled.div`
  grid-column: 1 / -1;
`;
const Content = styled.div`
  grid-column: 2 / 3;
`;
const Tabs = styled.div`
  max-width: 300px;
  grid-column: 1 / 2;
  grid-row-end: span 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-right: 1px solid var(--lineColor);
  a {
    font-size: 26px;
    text-decoration: none;
    color: black;
  }
  .active {
    color: green;
  }
`;

function MyApp({ Component, pageProps, apollo }) {
  const router = useRouter();
  return (
    <>
      <GlobalStyle />
      <ApolloProvider client={apollo}>
        <AppLayout>
          <NavWrapper>
            <Nav />
          </NavWrapper>
          <Tabs>
            <Link href="/budget">
              <a className={router.pathname === '/budget' ? 'active' : ''}>Budget</a>
            </Link>
            <Link href="/transactions">
              <a className={router.pathname === '/transactions' ? 'active' : ''}>Transactions</a>
            </Link>
          </Tabs>
          <Content>
            <Component {...pageProps} />
          </Content>
        </AppLayout>
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
