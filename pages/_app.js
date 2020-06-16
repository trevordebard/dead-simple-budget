import { ApolloProvider } from '@apollo/client';
import styled, { createGlobalStyle } from 'styled-components';
import { withApollo } from '../lib/withApollo';
import Nav from '../components/nav';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
const Content = styled.div`
  width: 100%;
  max-width: 682px;
  margin: 0px auto;
  padding: 0px 1rem;
`;

function MyApp({ Component, pageProps, apollo }) {
  return (
    <>
      <GlobalStyle />
      <ApolloProvider client={apollo}>
        <Nav />
        <Content>
          <Component {...pageProps} />
        </Content>
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
