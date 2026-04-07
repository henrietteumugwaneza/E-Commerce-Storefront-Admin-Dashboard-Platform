import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { role, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 shadow">
      <Link to="/">Store</Link>

      <div className="flex gap-4">
        {role === "ADMIN" && <Link to="/admin">Dashboard</Link>}
        {role === "USER" && <Link to="/cart">Cart</Link>}
        {!role ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;