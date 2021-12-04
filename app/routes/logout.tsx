import { ActionFunction, LoaderFunction, redirect } from "remix";
import { destroySession, getSession } from "~/session.server";

export let action: ActionFunction = async ({ request }) => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(await getSession(request)),
    },
  });
};

export let loader: LoaderFunction = () => {
  throw new Response("", { status: 404 });
};