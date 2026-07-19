import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white">
      <h1 className="text-8xl font-bold text-blue-500">404</h1>

      <p className="text-2xl mt-4">Page Not Found</p>

      <p className="text-slate-400 mt-2">
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default NotFound;