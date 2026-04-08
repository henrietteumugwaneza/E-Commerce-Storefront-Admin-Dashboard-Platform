import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import type { Product } from "../../types";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { role } = useAuth();

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/public/products/${id}`);
      return res.data?.data?.product ?? res.data?.data ?? res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError || !product) return (
    <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-slate-700 font-semibold text-lg mb-2">Product not found</p>
      <p className="text-slate-400 text-sm mb-6">This product may have been removed.</p>
      <Link to="/"><Button variant="secondary">Back to Store</Button></Link>
    </div>
  );

  const image = product.images?.[0]?.url ?? "https://placehold.co/600x400?text=No+Image";
  const inStock = product.stock > 0;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Store
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-slate-50 aspect-square">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image"; }}
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-slate-800 font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 sm:p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {product.category?.name}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${inStock ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">{product.name}</h1>
            <p className="text-sm text-slate-400 mb-5 font-medium">by {product.brand}</p>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">{product.description}</p>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
                {product.stock <= 5 && inStock && (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {role === "USER" ? (
                <Button size="lg" className="w-full" disabled={!inStock}
                  onClick={() => { addToCart(product); toast.success("Added to cart!"); }}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              ) : !role ? (
                <Link to="/login">
                  <Button size="lg" className="w-full">Login to Purchase</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
