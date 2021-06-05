import React, { useCallback, useEffect, useState } from 'react';
import plaid from 'plaid';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { PrismaClient } from '.prisma/client';
import { useQuery } from 'react-query';

async function fetchTransactions(params) {
  const [, { accessTokens }] = params.queryKey;
  const response = await axios.get('/api/plaid/get_transactions', {
    params: { accessToken: accessTokens[0] },
  });
  return response;
}

const Plaid = ({ linkToken, plaidAccessTokens }) => {
  const [accessTokens, setAccessTokens] = useState<string[]>(plaidAccessTokens);
  const [transactions, setTransactions] = useState<null | string>();
  const { data, error: e } = useQuery(['transactions', { accessTokens }], fetchTransactions, {
    enabled: accessTokens.length > 0,
  });
  useEffect(() => {
    if (data) {
      setTransactions(data.data);
    }
  }, [data]);
  const onSuccess = useCallback(async (publicToken, metadata) => {
    // assuming user will not call this method if they already have a bank account on file
    const data = await axios.get('/api/plaid/exchange_public_token', { params: { publicToken } });
    setAccessTokens([...accessTokens, data.data.access_token]);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open } = usePlaidLink(config);
  return (
    <div>
      <button onClick={() => open()}>Connect a bank account</button>
      <pre>{transactions && JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
};
export default Plaid;

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const prisma = new PrismaClient();
  const session = await getSession(context);

  const accessTokenResponse = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { bankAccounts: true },
  });
  const accessTokens = accessTokenResponse.bankAccounts.map((entry) => entry.plaidAccessToken);

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
      plaidAccessTokens: accessTokens,
    },
  };
};
