import { Link } from 'remix';
import { useRootData } from '~/utils/use-root-data';

export function Nav() {
  const { user } = useRootData();
  if (!user) {
    return null;
  }
  return (
    <div>
      <div className="col-span-full text-gray-600">
        <header className="body-font">
          <div className="flex py-5 flex-row justify-between">
            <Link to="/" className="flex text-lg font-medium text-gray-800">
              Dead Simple Budget
            </Link>
            <form action="/logout" method="post" className="text-right">
              <button
                type="submit"
                className="inline-flex items-center border py-1 px-3 focus:outline-none hover:bg-gray-100 rounded-md text-base"
              >
                Logout
              </button>
            </form>
          </div>
        </header>
      </div>
    </div>
  );
}
