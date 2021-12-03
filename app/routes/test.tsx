import { Stack, User } from ".prisma/client";
import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData, redirect } from "remix";
import { db } from "~/utils/db.server";

// TODO: remove null option for user
type LoaderData = { stacks: Stack[], user: User | null };

export let loader: LoaderFunction = async () => {
  let user
  try {
    user = await db.user.findUnique({ where: { email: 'trevordebard@gmail.com' } });
  } catch (e) {
    throw redirect(`/login}`);
  }

  let data: LoaderData = {
    stacks: await db.stack.findMany(),
    user
  };
  return data;
};

export default function Test() {
  const { user, stacks } = useLoaderData<LoaderData>()
  return (
    <div>
      <div>
        <p>Total: {user?.total}</p>
        <p>To Be Budgeted: {user?.toBeBudgeted}</p>
      </div>
    </div>
  )
}