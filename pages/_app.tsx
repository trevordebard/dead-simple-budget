import { Provider } from 'next-auth/client';
import { Alert } from 'components/Alert';
import { AlertProvider } from '../components/Alert/AlertProvider';
import Head from '../components/head';
import { GlobalStyle } from 'components/Shared/GlobalStyle';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import { Hydrate } from 'react-query/hydration';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <GlobalStyle />
      <Head />
      <Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <Alert />
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={true} />
          </AlertProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default MyApp;
