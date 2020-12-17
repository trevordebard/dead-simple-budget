import { ApolloProvider } from '@apollo/client';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'next-auth/client';
import { Alert } from 'components/Alert';
import { AlertProvider } from '../components/Alert/AlertProvider';
import { useApollo } from '../lib/apolloClient';
import Head from '../components/head';
import { GlobalStyle } from 'components/Shared/GlobalStyle'

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState, null);

  return (
    <>
      <GlobalStyle />
      <Head />
      <Provider session={pageProps.session}>
        <AlertProvider>
          <ApolloProvider client={apolloClient}>
            <Alert />
            <Component {...pageProps} />
          </ApolloProvider>
        </AlertProvider>
      </Provider>
    </>
  );
}

export default MyApp;
