import { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/lib/modules/auth';

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/budget',
  });
};
export default function Login() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <div className="w-full max-w-md mx-auto mt-56 rounded-lg border-gray-100 shadow-lg py-10 px-8">
          <h1 className="text-2xl font-medium mb-8 text-center">Dead Simple Budget</h1>

          <form action="/auth/google" method="post">
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-400 rounded-lg hover:border-gray-600 focus:border-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 48 48">
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use xlinkHref="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
              </svg>
              Continue With Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
