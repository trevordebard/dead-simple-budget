import { useLocation, Link } from 'remix';

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <div>
      <nav className="flex justify-center items-center text-base space-x-5 md:flex-col md:space-y-5 md:space-x-0">
        <Link
          to="/budget"
          className={
            pathname.split('/')[1] === 'budget'
              ? 'px-4 py-2 md:py-3 text-sm font-semibold bg-purple-200 rounded-lg md:w-full text-purple-800 hover:no-underline hover:text-purple-800'
              : 'px-4 py-2 md:py-3 text-sm font-semibold md:w-full rounded-lg text-gray-900 hover:bg-gray-100 hover:no-underline hover:text-gray-800'
          }
        >
          Budget
        </Link>
        <Link
          to="/transactions"
          className={
            pathname.split('/')[1] === 'transactions'
              ? 'px-4 py-2 md:py-3 text-sm font-semibold bg-purple-200 rounded-lg md:w-full text-purple-800 hover:no-underline hover:text-purple-800'
              : 'px-4 py-2 md:py-3 text-sm font-semibold md:w-full rounded-lg text-gray-900 hover:bg-gray-100 hover:no-underline hover:text-gray-800'
          }
        >
          Transactions
        </Link>
      </nav>
    </div>
  );
}
