import { ApolloProvider } from '@apollo/client';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'next-auth/client';
import { Alert } from 'components/Alert';
import { AlertProvider } from '../components/Alert/AlertProvider';
import { useApollo } from '../lib/apolloClient';
import Head from '../components/head';
import { GlobalStyle } from 'components/Shared/GlobalStyle';
import { QueryClient, QueryClientProvider } from 'react-query';

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState, null);
  const queryClient = new QueryClient();
  return (
    <>
      <GlobalStyle />
      <Head />
      <Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <ApolloProvider client={apolloClient}>
              <Alert />
              <Component {...pageProps} />
            </ApolloProvider>
          </AlertProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default MyApp;
