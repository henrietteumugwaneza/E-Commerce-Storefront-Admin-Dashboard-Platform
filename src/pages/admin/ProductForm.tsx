import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import type { Category, Product } from "../../types";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().min(20, "Description must be at least 20 characters").trim(),
  brand: z.string().min(1, "Brand is required").trim(),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Select a category"),
  images: z.array(z.object({ url: z.string().min(1, "Image URL is required") })).min(1, "At least one image is required"),
});
type FormData = z.infer<typeof schema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data?.data ?? res.data ?? [];
    },
  });

  const { data: product, isLoading: loadingProduct } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/public/products/${id}`);
      return res.data?.data?.product ?? res.data?.data ?? res.data;
    },
    enabled: isEdit,
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { images: [{ url: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images?.length ? product.images.map((img) => ({ url: img.url })) : [{ url: "" }],
      });
    }
  }, [product, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      const payload = { ...data, images: data.images.map((i) => i.url) };
      return isEdit
        ? api.patch(`/admin/products/${id}`, payload)
        : api.post("/admin/products", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEdit ? "Product updated!" : "Product created!");
      navigate("/admin/products");
    },
    onError: (err: any) => toast.error(err.message || "Failed to save product"),
  });

  if (isEdit && loadingProduct) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <Input label="Name" placeholder="Product name" error={errors.name?.message} {...register("name")} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea rows={4} placeholder="Describe the product (min 20 characters)"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${errors.description ? "border-red-400 bg-red-50" : "border-slate-300"}`}
            {...register("description")} />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <Input label="Brand" placeholder="Brand name" error={errors.brand?.message} {...register("brand")} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price ($)" type="number" step="0.01" placeholder="0.00" error={errors.price?.message} {...register("price")} />
          <Input label="Stock Quantity" type="number" placeholder="0" error={errors.stock?.message} {...register("stock")} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Category</label>
          <select className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${errors.categoryId ? "border-red-400" : "border-slate-300"}`}
            {...register("categoryId")}>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">Images</label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input placeholder="https://example.com/image.jpg"
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.images?.[index]?.url ? "border-red-400 bg-red-50" : "border-slate-300"}`}
                  {...register(`images.${index}.url`)} />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                )}
              </div>
            ))}
            {errors.images?.root && <p className="text-xs text-red-500">{errors.images.root.message}</p>}
          </div>
          <button type="button" onClick={() => append({ url: "" })} className="mt-2 text-sm text-indigo-600 hover:underline">
            + Add another image
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending}>{isEdit ? "Update Product" : "Create Product"}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
