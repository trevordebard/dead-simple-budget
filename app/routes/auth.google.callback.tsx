import { LoaderFunction } from "remix";
import { authenticator } from "~/auth/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("google", request, {
    successRedirect: "/budget",
    failureRedirect: "/login",
  });
};