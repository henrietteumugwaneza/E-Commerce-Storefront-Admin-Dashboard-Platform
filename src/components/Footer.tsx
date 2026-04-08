import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">ShopZone</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Your one-stop shop for everything you love. Quality products, fast delivery, secure checkout.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Best Sellers</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Deals & Offers</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li><span className="hover:text-white transition-colors cursor-default">Help Center</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Track Order</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Returns Policy</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Contact Us</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <p>© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-default transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-default transition-colors">Terms of Service</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            All systems operational
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
