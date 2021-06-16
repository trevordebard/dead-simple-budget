// TODO: determine if next-connect is required
import nextConnect from 'next-connect';
import plaid from 'plaid';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;
// const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
const PLAID_ENV = process.env.PLAID_ENV;

var ACCESS_TOKEN = null;
var ITEM_ID = null;

// Initialize the Plaid client
export const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments.sandbox, // TODO: make env

  options: {
    version: '2020-09-14',
    timeout: 30 * 60 * 1000, // 30 minutes }
  },
});

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('yoooooooo');
  const { metadata, public_token, userEmail } = req.body;
  // const { institution, accounts } = metadata;
  // const { name, institution_id } = institution;

  try {
    if (public_token) {
      console.log('exchanging');
      client.exchangePublicToken(public_token, function (error, tokenResponse) {
        console.log('client: ', client);
        console.log('tokenResponse: ', tokenResponse);
        ACCESS_TOKEN = tokenResponse.access_token;
        ITEM_ID = tokenResponse.item_id;
        console.log('access token below');
        console.log(ACCESS_TOKEN);

        // Pull transactions for the last 30 days
        let startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        console.log('ACCESS TOKEN ->', ACCESS_TOKEN);
        client.getTransactions(
          ACCESS_TOKEN,
          startDate,
          endDate,
          {
            count: 250,
            offset: 0,
          },
          function (error, transactionsResponse) {
            const { transactions } = transactionsResponse;
            // TRANSACTIONS LOGGED BELOW!
            // They will show up in the terminal that you are running the server in
            console.log('transactions:', transactions);
            res.json({
              ok: true,
              message: 'Success!',
              access_token: ACCESS_TOKEN,
              item_id: ITEM_ID,
              transactions: transactions,
            });
          }
        );
      });
    } else {
      console.log('nope');
      const oh = await client.createLinkToken({
        client_name: 'dead simple budget',
        country_codes: ['US'],
        language: 'en',
        user: { client_user_id: '1234' },
        products: ['auth', 'transactions'],
      });
      // console.log(await client.searchInstitutionsByName('ally', ['transactions'], ['US'], {}))
      const sandbox = await client.sandboxPublicTokenCreate('ins_25', ['transactions'], {
        transactions: {
          start_date: '2021-01-01',
          end_date: '2021-05-05',
        },
      });
      console.log({ sandbox });

      // res.json(oh)
      // console.log({ oh });
      const exchangeTokenResponse = await client.exchangePublicToken(sandbox.public_token);
      const transaction = await client.getTransactions(exchangeTokenResponse.access_token, '2021-01-01', '2021-01-04');
      client.getAllTransactions;
      console.log({ transaction });
      console.log({ exchangeTokenResponse });
      res.json('hmm');
      // res.json({ blah })
    }
  } catch (err) {
    res.json({
      ok: false,
      message: err.toString(),
      blah: err.error_message,
    });
  }
});

export default handler;
