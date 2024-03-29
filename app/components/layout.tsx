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
      <div className="w-full md:w-1/6 md:mb-4">
        <Sidebar />
      </div>
      {children}
    </div>
  );
}

export function ContentMain({ children }: MainProps) {
  return <main className="flex-grow mt-2 md:mt-0 md:mx-auto max-w-3xl order-last md:order-none">{children}</main>;
}

export function ContentAction({ children }: ActionProps) {
  return <aside className="w-full md:w-1/4">{children}</aside>;
}
