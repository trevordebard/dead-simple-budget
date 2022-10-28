import { User } from '@prisma/client';

import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/modules/auth';

import { GoogleStrategy } from 'remix-auth-google';
import { findOrCreateUser } from '~/lib/modules/user';

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.AUTH_CALLBACK_URL as string,
  },
  async ({ profile }) => {
    return findOrCreateUser(profile.emails[0].value);
  }
);

authenticator.use(googleStrategy);
