import { ActionFunction, LoaderFunction, redirect } from "remix";
import { authenticator } from "~/auth/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("google", request);
};