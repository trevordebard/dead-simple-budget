import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

import { setContext } from '@apollo/client/link/context';

let apolloClient;
const getCookies = function(request): any {
  const cookies = {};
  if (request.headers.cookie) {
    request.headers &&
      request.headers.cookie.split(';').forEach(function(cookie) {
        const parts = cookie.match(/(.*?)=(.*)$/);
        cookies[parts[1].trim()] = (parts[2] || '').trim();
      });
  }
  return cookies;
};
function getToken(req): string {
  const cookies = getCookies(req);
  return cookies.token || null;
}

function createApolloClient(ctx) {
  let headers = {};
  let accessToken = '';
  if (ctx) {
    accessToken = getToken(ctx.req);
    if (accessToken) {
      headers = {
        Authorization: accessToken,
      };
    }
  }

  const httpLink = createUploadLink({
    uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
  });
  const authLink = setContext((req, { headers }) =>
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    ({
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })
  );
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    credentials: 'include',
    headers,
    // defaultOptions: defaultOptions
  });
}

export function initializeApollo(initialState = null, ctx) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState, ctx) {
  const store = useMemo(() => initializeApollo(initialState, ctx), [initialState, ctx]);
  return store;
}
