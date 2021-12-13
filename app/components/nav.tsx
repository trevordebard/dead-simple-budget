import { Link } from 'remix';
import { AuthenticatedUser } from '~/types/user';

type NavProps = {
  user: AuthenticatedUser | null;
};

export function Nav({ user = null }: NavProps) {
  return (
    <div className="col-span-full text-gray-600">
      <header className="body-font">
        <div className="flex py-5 flex-row justify-between">
          <Link to="/" className="flex text-lg font-medium text-gray-800">
            Dead Simple Budget
          </Link>
          {user ? (
            <form action="/logout" method="post" className="text-right">
              <button
                type="submit"
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
              >
                Logout
              </button>
            </form>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
    </div>
  );
}
