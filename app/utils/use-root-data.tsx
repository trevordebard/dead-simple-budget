import { useMatches } from 'remix';
import { RootLoaderData } from '~/root';

export function useRootData(): RootLoaderData {
  const data = useMatches();
  const rootData = data.find(({ handle }) => handle?.id === 'root')?.data as RootLoaderData; // TODO: type checking
  return rootData;
}
