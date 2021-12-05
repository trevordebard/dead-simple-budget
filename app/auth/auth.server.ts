import { Budget, User } from ".prisma/client";
import { Authenticator, GoogleStrategy } from "remix-auth";
import { findOrCreateUser } from "~/utils/server";
import { sessionStorage } from "~/auth/session.server";

export let authenticator = new Authenticator<(User & {
  Budget: Budget | null;
}) | null>(sessionStorage);


if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET env");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID env");
}
if (!process.env.AUTH_CALLBACK_URL) {
  throw new Error("Missing AUTH_CALLBACK_URL env");
}

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK_URL,
    },
    async (_, __, ___, profile) => findOrCreateUser(profile.emails[0].value)
  )
);