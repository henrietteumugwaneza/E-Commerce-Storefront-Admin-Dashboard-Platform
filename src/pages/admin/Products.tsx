import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import type { Product } from "../../types";
import toast from "react-hot-toast";

const Products = () => {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/public/products");
      return res.data?.data?.all ?? [];
    },
  });

  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err.message || "Delete failed"),
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Products</h2>
        <Link to="/admin/products/new"><Button>+ Add Product</Button></Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Product</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Category</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Price</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Stock</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url ?? "https://placehold.co/40x40?text=?"}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=?"; }}
                    />
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-[200px]">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{p.category?.name}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">${p.price.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link to={`/admin/products/${p.id}/edit`}><Button variant="secondary" size="sm">Edit</Button></Link>
                    <Button variant="danger" size="sm" onClick={() => setDeleteId(p.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-12 text-slate-400">No products yet.</p>}
      </div>

      <Modal open={deleteId !== null} title="Delete Product" confirmLabel="Delete" confirmVariant="danger"
        loading={isPending} onConfirm={() => deleteId && deleteProduct(deleteId)} onClose={() => setDeleteId(null)}>
        Are you sure you want to delete this product? This action cannot be undone.
      </Modal>
    </div>
  );
};

export default Products;
