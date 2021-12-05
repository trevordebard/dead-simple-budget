import { Budget, User } from ".prisma/client";
import { Authenticator, GoogleStrategy } from "remix-auth";
import { login } from "~/models/user";
import { sessionStorage } from "~/services/session.server";

export let authenticator = new Authenticator<(User & {
  Budget: Budget | null;
}) | null>(sessionStorage);


if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET env");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID env");
}

authenticator.use(
  new GoogleStrategy(
    {

      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (_, __, ___, profile) => login(profile.emails[0].value)
  )
);