import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl text-indigo-600 tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            ShopZone
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/") ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              Store
            </Link>
            {role === "ADMIN" && (
              <Link to="/admin" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/admin") ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                Admin Dashboard
              </Link>
            )}
            {role === "USER" && (
              <>
                <Link to="/profile" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/profile") ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                  My Orders
                </Link>
                <Link to="/cart" className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive("/cart") ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  {count > 0 && (
                    <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                      {count}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm">
                  Get started
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setOpen(!open)}>
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1 pb-4">
            <Link to="/" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Store</Link>
            {role === "ADMIN" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Admin Dashboard</Link>
            )}
            {role === "USER" && (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl">My Orders</Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2">
                  Cart {count > 0 && <span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">{count}</span>}
                </Link>
              </>
            )}
            <div className="border-t border-slate-100 mt-2 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Sign in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl">Get started</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">Logout</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
