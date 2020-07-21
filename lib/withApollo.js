import withApolloNext from 'next-with-apollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';

function createClient({ headers }) {
  return new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
    cache: new InMemoryCache(),
    request: operation => {
      operation.setContext({
        credentials: 'include',
      });
    },
  });
}

export const withApollo = withApolloNext(createClient);
