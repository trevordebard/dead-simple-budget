import { HTMLProps } from 'react';

export function Button(props?: HTMLProps<HTMLButtonElement>) {
  return (
    <input
      type="submit"
      value="Add Stack"
      {...props}
      className="rounded-md cursor-pointer px-4 py-2 bg-gray-700 text-gray-50 hover:bg-gray-600 font-normal"
    />
  );
}
