import { Link } from 'remix';
import { useRootData } from '~/utils/use-root-data';
import { Button } from './button';

export function Nav() {
  const { user } = useRootData();
  if (!user) {
    return null;
  }
  return (
    <div>
      <div className="col-span-full">
        <header className="body-font">
          <div className="flex py-5 flex-row justify-between">
            <Link to="/budget" className="flex text-lg font-medium text-gray-800">
              Dead Simple Budget
            </Link>
            <form action="/logout" method="post" className="text-right">
              <Button type="submit" size="xs" variant="transparent" className="text-base hover:bg-gray-100">
                Logout
              </Button>
            </form>
          </div>
        </header>
      </div>
    </div>
  );
}
