import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { Loader } from "../../components/ui/Loader";
import type { Order, OrderStatus } from "../../types";
import toast from "react-hot-toast";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const Orders = () => {
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const res = await api.get("/auth/orders/admin/all");
      return res.data?.data ?? res.data ?? [];
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.patch(`/auth/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-orders"] });
      toast.success("Order status updated");
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">All Orders</h2>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Order</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Customer</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Date</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Total</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-900">#{order.id.slice(-8)}</td>
                <td className="px-5 py-3 text-slate-600">{order.user?.email ?? "—"}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">${order.totalAmount?.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus({ id: order.id, status: e.target.value as OrderStatus })}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-slate-400">No orders yet.</p>}
      </div>
    </div>
  );
};

export default Orders;
