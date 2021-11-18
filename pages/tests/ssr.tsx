import { CategorizedStacks } from 'components/Stack';

import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { fetchStacksByCategory } from 'lib/hooks/stack/useCategorizedStacks';

const BudgetPage = () => {
  return (
    <div>
      <div>hi</div>
      <CategorizedStacks />
    </div>
  );
};
export default BudgetPage;

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('fetch-stacks-by-category', async () => fetchStacksByCategory(context.req.headers));

  const session = {
    user: {
      name: 'Test Jones',
      email: process.env.EMAIL,
    },
    expires: '2021-12-18T03:07:58.137Z',
  };

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
