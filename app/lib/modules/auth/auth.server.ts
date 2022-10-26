import { User } from '@prisma/client';

import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/lib/modules/auth";

export let authenticator = new Authenticator<User>(sessionStorage);

import { GoogleStrategy } from "remix-auth-google";
import { findOrCreateUser } from "~/lib/modules/user";

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.AUTH_CALLBACK_URL as string
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    return await findOrCreateUser(profile.emails[0].value)
  }
);

authenticator.use(googleStrategy);
