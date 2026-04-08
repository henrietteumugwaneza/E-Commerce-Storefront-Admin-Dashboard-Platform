import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { Loader } from "../../components/ui/Loader";
import type { Product, Order } from "../../types";
import { Link } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const StatCard = ({ label, value, color, bg, icon }: { label: string; value: number | string; color: string; bg: string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: products = [], isLoading: loadingP } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/public/products");
      return res.data?.data?.all ?? [];
    },
  });

  const { data: orders = [], isLoading: loadingO } = useQuery<Order[]>({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const res = await api.get("/auth/orders/admin/all");
      return res.data?.data ?? res.data ?? [];
    },
  });

  if (loadingP || loadingO) return <Loader />;

  const revenue = orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={products.length} color="text-indigo-600" bg="bg-indigo-50"
          icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatCard label="Total Orders" value={orders.length} color="text-slate-900" bg="bg-slate-100"
          icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard label="Pending Orders" value={pending} color="text-amber-600" bg="bg-amber-50"
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Total Revenue" value={`$${revenue.toFixed(2)}`} color="text-green-600" bg="bg-green-50"
          icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-semibold text-slate-800 font-mono">#{order.id.slice(-8)}</span>
              <span className="text-slate-500 hidden sm:block">{order.user?.email ?? "—"}</span>
              <span className="font-bold text-slate-900">${order.totalAmount?.toFixed(2)}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600"}`}>
                {order.status}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
