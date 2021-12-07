import { Link, useLocation } from 'remix';
import { AuthenticatedUser } from '~/types/user';

type NavProps = {
  user: AuthenticatedUser | null;
};

export function Nav({ user = null }: NavProps) {
  const location = useLocation();
  return (
    <div className="col-span-full">
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
          <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="text-xl">Dead Simple Budget</span>
          </Link>
          {user ? (
            <>
              <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center space-x-5">
                <Link
                  to="/budget"
                  className={`${location.pathname.split('/')[1] === 'budget' &&
                    'text-purple-800 border-b border-purple-800 hover:text-purple-500 hover:border-purple-500 hover:no-underline '
                    }`}
                >
                  Budget
                </Link>
                <Link to="/transactions">Transactions</Link>
              </nav>
              <form action="/logout" method="post" className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
    </div>
  );
}
