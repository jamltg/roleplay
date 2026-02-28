import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="bg-gray-100 p-4 shadow-md">
      <Link to="/" className="mr-4 text-blue-500 hover:underline">
        Home
      </Link>
      <Link to="/members" className="mr-4 text-blue-500 hover:underline">
        Members
      </Link>
    </nav>
  );
}

export default Navigation;