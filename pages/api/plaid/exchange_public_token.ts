import plaid from 'plaid';
import { NextApiRequest, NextApiResponse } from 'next';
import { format, sub } from 'date-fns';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;
const PLAID_ENV = process.env.PLAID_ENV;

// Initialize the Plaid client
export const client = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: plaid.environments.sandbox, // TODO: make env
    options: {
        version: '2020-09-14',
        timeout: 30 * 60 * 1000, // 30 minutes }

    }
});
export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body.publicToken)
    const data = await client.exchangePublicToken(req.query.publicToken as string)
    res.status(200).json(data)
}

