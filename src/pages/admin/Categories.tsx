import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../api/axios";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import type { Category } from "../../types";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const Categories = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data?.data ?? res.data ?? [];
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ name: "", description: "" }); setShowForm(true); };
  const openEdit = (cat: Category) => { setEditing(cat); reset({ name: cat.name, description: cat.description ?? "" }); setShowForm(true); };

  const { mutate: save } = useMutation({
    mutationFn: (data: FormData) =>
      editing ? api.put(`/categories/${editing.id}`, data) : api.post("/categories", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(editing ? "Category updated" : "Category created");
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed"),
  });

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err.message || "Delete failed"),
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
        <Button onClick={openCreate}>+ Add Category</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-slate-600 font-medium">Description</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-900">{cat.name}</td>
                <td className="px-5 py-3 text-slate-500">{cat.description ?? "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(cat)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteId(cat.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center py-12 text-slate-400">No categories yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{editing ? "Edit Category" : "New Category"}</h3>
            <form onSubmit={handleSubmit((d) => save(d))} className="space-y-4">
              <Input label="Name" placeholder="Category name" error={errors.name?.message} {...register("name")} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Description (optional)</label>
                <textarea rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" {...register("description")} />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" loading={isSubmitting}>{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal open={deleteId !== null} title="Delete Category" confirmLabel="Delete" confirmVariant="danger"
        loading={deleting} onConfirm={() => deleteId && deleteCategory(deleteId)} onClose={() => setDeleteId(null)}>
        Are you sure you want to delete this category?
      </Modal>
    </div>
  );
};

export default Categories;
