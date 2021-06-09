import React, { useCallback, useEffect, useState } from 'react';
import plaid from 'plaid';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { PrismaClient } from '.prisma/client';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

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
  const onSuccess = useCallback(async (publicToken, metadata) => {
    // assuming user will not call this method if they already have a bank account on file
    const data = await axios.get<plaid.TokenResponse>('/api/plaid/exchange_public_token', { params: { publicToken } });
    if (data.data.access_token) {
      // TODO: could we make this dynamic?
      router.push('/transactions');
    }
  }, []);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;

  const plaidClient = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: plaid.environments.sandbox, // TODO: make env

    options: {
      version: '2020-09-14',
      timeout: 30 * 60 * 1000, // 30 minutes }
    },
  });

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
