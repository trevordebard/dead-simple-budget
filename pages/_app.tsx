import { SessionProvider } from 'next-auth/react';

import { Alert } from 'components/Alert';
import { AlertProvider } from '../components/Alert/AlertProvider';
import Head from '../components/head';
import { GlobalStyle } from 'components/Shared/GlobalStyle';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import { Hydrate } from 'react-query/hydration';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import 'public/static/nprogress.css';

Router.events.on('routeChangeStart', url => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <GlobalStyle />
      <Head />
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <Alert />
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={true} />
          </AlertProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
