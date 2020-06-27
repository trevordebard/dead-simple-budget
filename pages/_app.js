import { ApolloProvider } from '@apollo/client';
import styled, { createGlobalStyle } from 'styled-components';
import { withApollo } from '../lib/withApollo';
import Nav from '../components/nav';
import Head from '../components/head';
import LeftSidebar from '../components/LeftSidebar';

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 10px;
    --purp: hsl(282, 44%, 47%);
    --purp-15: hsl(282, 44%, 47%, 15%);
    --aqua: #2DADBA;
    --yellow: #FAEA7A;
    --green: hsl(152, 55%,44%);
    --green10: hsl(152, 55%,44%, 10%);
    --lineColor: #EAEAEA;
    --fontColor: hsl(211, 39%, 23%);
    --fontColor60: hsl(211, 39%, 23%, 60%);
    --primary: var(--purp);
    --action: var(--aqua);
    --neutral: var(--fontColor);
  }
  * {
    box-sizing: border-box;
  }
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    color: var(--fontColor);
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
    font-family: 'Roboto', sans-serif;
    font-size: 1.6rem;
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
`;

const AppLayout = styled.div`
  display: grid;
  width: 100vw;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  grid-column-gap: 15px;
`;
const NavWrapper = styled.div`
  grid-column: 1 / -1;
`;
const Content = styled.div`
  padding-top: 30px;
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function MyApp({ Component, pageProps, apollo }) {
  return (
    <>
      <GlobalStyle />
      <Head />
      <ApolloProvider client={apollo}>
        <AppLayout>
          <NavWrapper>
            <Nav />
          </NavWrapper>
          <LeftSidebar />
          <Content>
            <Component {...pageProps} />
          </Content>
        </AppLayout>
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
