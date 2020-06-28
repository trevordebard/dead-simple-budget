import { ApolloProvider } from '@apollo/client';
import styled, { createGlobalStyle } from 'styled-components';
import { withApollo } from '../lib/withApollo';
import Nav from '../components/nav';
import Head from '../components/head';
import LeftSidebar from '../components/LeftSidebar';
import { smBreakpoint } from '../lib/constants';

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
    --backgroundSubtle: hsl(211, 39%, 23%, 3%); 
    --primary: var(--purp);
    --action: var(--aqua);
    --neutral: var(--fontColor);
  }
  * {
    box-sizing: border-box;
  }
  html,body {
    max-width: 100%;
    overflow-x: hidden;
  }
  body {
    height: calc(100vh-30px);
    margin: 0;
    padding: 5px;
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
  grid-template-columns: minmax(auto, 300px) 3fr;
  grid-template-rows: minmax(auto, 9rem) auto;
  height: 100vh;
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(auto, 9rem) min-content auto;
    margin: auto 0;
  }
`;
const NavWrapper = styled.div`
  grid-column: 1 / -1;
`;
const SidebarWrapper = styled.div`
  max-width: 300px;
  grid-column: 1 / 2;
  border-right: 1px solid var(--lineColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-column: 1 / -1;
    max-width: 100vw;
    height: min-content;
    flex-direction: row;
    justify-content: center;
    background-color: var(--backgroundSubtle);
  }
`;
const Content = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-column: 1;
    max-width: 100vw !important;
  }
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
          <SidebarWrapper>
            <LeftSidebar />
          </SidebarWrapper>
          <Content>
            <Component {...pageProps} />
          </Content>
        </AppLayout>
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
