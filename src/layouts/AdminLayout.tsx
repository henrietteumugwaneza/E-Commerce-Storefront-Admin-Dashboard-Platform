import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  )},
  { to: "/admin/products", label: "Products", end: false, icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  )},
  { to: "/admin/orders", label: "Orders", end: false, icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  )},
  { to: "/admin/categories", label: "Categories", end: false, icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  )},
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-xl">
        {/* Brand */}
        <div className="p-6 border-b border-slate-700/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-white leading-none">Admin Panel</p>
              <p className="text-xs text-slate-400 mt-0.5">ShopZone</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <p className="text-xs text-slate-300 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <svg className="w-4.5 h-4.5 shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">ADMIN</span>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white px-8 py-4 flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} ShopZone Admin Panel</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            All systems operational
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
