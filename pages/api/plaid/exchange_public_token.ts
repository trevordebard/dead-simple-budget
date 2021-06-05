import plaid from 'plaid';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client';
const prisma = new PrismaClient({});

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;

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
    // TODO: redirect if user is not logged in
    const session = await getSession({ req })
    console.log(req.body.publicToken)
    const data = await client.exchangePublicToken(req.query.publicToken as string)

    // add bank account and access token to db
    await prisma.bankAccout.create({ data: { plaidAccessToken: data.access_token, plaidItemId: data.item_id, user: { connect: { email: session.user.email } } } })
    res.status(200).json(data)
}

