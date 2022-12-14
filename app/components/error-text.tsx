import { ReactChild } from 'react';

export function ErrorText({ children }: { children: ReactChild }) {
  return <span className="text-red-600">{children}</span>;
}
