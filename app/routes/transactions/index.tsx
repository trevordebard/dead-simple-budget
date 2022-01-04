import { Link } from 'remix';

export default function Transactions() {
  return (
    <div className="flex flex-col items-center">
      <Link
        to="new"
        className="w-48 rounded-md cursor-pointer px-4 py-2 bg-gray-700 text-gray-50 hover:bg-gray-600 text-center decoration-transparent hover:no-underline hover:text-gray-50"
      >
        Create Transaction
      </Link>
    </div>
  );
}
