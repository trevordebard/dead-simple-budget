import React, { useCallback, useState } from 'react';
import plaid from 'plaid';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { plaidClient } from 'lib/plaidClient';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

async function fetchTransactions(params) {
  const [, { accessTokens }] = params.queryKey;
  const response = await axios.get('/api/plaid/get_transactions', {
    params: { accessToken: accessTokens[0] },
  });
  return response;
}

const Plaid = ({ linkToken }) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<null | string>();
  const onSuccess = useCallback(
    async (publicToken, metadata) => {
      // assuming user will not call this method if they already have a bank account on file
      const data = await axios.get<plaid.TokenResponse>('/api/plaid/exchange_public_token', {
        params: { publicToken },
      });
      if (data.data.access_token) {
        // TODO: could we make this dynamic?
        router.push('/transactions');
      }
    },
    [router]
  );

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open } = usePlaidLink(config);
  open();
  return (
    <div>
      <pre>{transactions && JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
};
export default Plaid;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const linktokenResponse = await plaidClient.createLinkToken({
    client_name: 'dead simple budget',
    country_codes: ['US'],
    language: 'en',
    user: { client_user_id: '1234' },
    products: ['auth', 'transactions'],
  });

  return {
    props: {
      linkToken: linktokenResponse.link_token,
    },
  };
};
