import { ApolloProvider } from '@apollo/client';
import { withApollo } from '../lib/withApollo';

function MyApp({ Component, pageProps, apollo }) {
  return (
    <div>
      <ApolloProvider client={apollo} userId="5ec1d97edd768b5259f24b50">
        <Component {...pageProps} />
      </ApolloProvider>
    </div>
  );
}

export default withApollo(MyApp);
