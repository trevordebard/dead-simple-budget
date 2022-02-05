import { PlusCircleIcon } from '@heroicons/react/outline';
import { Link, useMatches } from 'remix';

export default function Transactions() {
  const matches = useMatches();
  const hasTransactions = matches.find((route) => route.pathname === '/transactions')?.data.transactions.length > 0;
  if (!hasTransactions) {
    return null;
  }
  return (
    <div className="space-x-1 text-gray-900 hover:text-gray-600">
      <Link to="new" className="flex space-x-1 text-gray-900 hover:text-gray-600 items-center">
        <PlusCircleIcon className="w-5 h-5 inline" />
        <p>Transaction</p>
      </Link>
    </div>
  );
}
