import withApolloNext from 'next-with-apollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';

function createClient({ headers }) {
  return new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
    request: operation => {
      operation.setContext({
        credentials: 'include',
      });
    },
  });
}

export const withApollo = withApolloNext(createClient);
