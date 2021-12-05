import { Link } from "remix"
import { AuthenticatedUser } from "~/types/user"

type NavProps = {
  user: AuthenticatedUser | null
}

export const Nav = ({ user = null }: NavProps) => (
  <nav className="py-3 flex justify-between">
    <h2 className="text-purple-600 text-xl">Dead Simple Budget</h2>
    {user ? (
      <div>
        {user.email}
        <form action="/logout" method="post" className="text-right">
          <button className="text-blue-800 hover:text-blue-500 text-right">Logout</button>
        </form>
      </div>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </nav>
)