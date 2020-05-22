import { ApolloProvider } from '@apollo/client';
import { withApollo } from '../lib/withApollo';

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo} userId="5ec1d97edd768b5259f24b50">
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default withApollo(MyApp);
