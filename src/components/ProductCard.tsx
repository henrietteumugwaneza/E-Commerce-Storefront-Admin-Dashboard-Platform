import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { role } = useAuth();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const image = product.images?.[0]?.url ?? "https://placehold.co/400x300?text=No+Image";
  const inStock = product.stock > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden bg-slate-50 aspect-[4/3]">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }}
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.stock <= 5 && inStock && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-indigo-600 mb-1">{product.category?.name}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mb-4">{product.brand}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
          {role === "USER" && (
            <Button size="sm" onClick={handleAdd} disabled={!inStock}>
              {inStock ? "Add to cart" : "Sold out"}
            </Button>
          )}
          {!role && (
            <Link to="/login">
              <Button size="sm" variant="secondary">Login to buy</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
