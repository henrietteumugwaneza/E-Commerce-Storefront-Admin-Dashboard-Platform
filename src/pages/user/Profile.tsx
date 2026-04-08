import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/ui/Loader";
import type { Order, OrderStatus } from "../../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

const Profile = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/auth/orders");
      return res.data?.data ?? res.data ?? [];
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* User card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-extrabold border border-white/30">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.email}</h2>
            <span className="inline-block mt-1 text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 capitalize">
              {user?.role?.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">My Orders</h2>
        {orders.length > 0 && (
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        )}
      </div>

      {isLoading && <Loader text="Loading orders..." />}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-slate-700 font-semibold mb-1">No orders yet</p>
          <p className="text-slate-400 text-sm">Your order history will appear here.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-bold text-slate-900 font-mono">#{order.id.slice(-8)}</span>
                <span className="text-xs text-slate-400 ml-3">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.product?.name} <span className="text-slate-400">×{item.quantity}</span></span>
                  <span className="font-medium text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="text-xs text-slate-400">{order.paymentMethod?.replace(/_/g, " ")}</span>
              <span className="font-extrabold text-slate-900">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
