import { ApolloProvider } from '@apollo/client';
import { withApollo } from '../lib/withApollo';
import Nav from '../components/nav';

function MyApp({ Component, pageProps, apollo }) {
  return (
    <>
      <ApolloProvider client={apollo}>
        <Nav />
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
