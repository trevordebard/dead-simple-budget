import type { LinksFunction } from '@remix-run/node';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, useCatch } from '@remix-run/react';
import * as React from 'react';
import { User } from '@prisma/client';
import { getAuthenticatedUser } from '~/lib/modules/user';
import { Nav } from '~/components/nav';
import styles from './styles/app.css';

export type RootLoaderData = {
  user: User | null;
};

export const handle = {
  id: 'root',
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  const data: RootLoaderData = { user };
  return json(data);
};

export const meta: MetaFunction = () => {
  return {
    title: 'Dead Simple Budget',
  };
};

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <div className="px-5 md:px-10">
        <Nav />
        <Outlet />
      </div>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>Hey, developer, you should replace this with what you want your users to see.</p>
      </div>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </div>
    </Document>
  );
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="w-screen h-screen  ">
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
