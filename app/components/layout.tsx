import * as React from 'react';
import { Sidebar } from '~/components/sidebar';

type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
};
type MainProps = {
  children: React.ReactNode | React.ReactNode[];
};
type ActionProps = {
  children: React.ReactNode | React.ReactNode[];
};

export function ContentLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-grow w-full flex-col md:flex-row md:gap-10">
      <div className="w-full md:w-1/6">
        <Sidebar />
      </div>
      {children}
    </div>
  );
}

export function ContentMain({ children }: MainProps) {
  return <main className="flex-grow mt-4 md:mt-0 md:mx-auto max-w-3xl">{children}</main>;
}

export function ContentAction({ children }: ActionProps) {
  return <aside className="p-10 md:p-0 w-1/4">{children}</aside>;
}
